const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Email = require("../utils/email");

const signToken = id => jwt.sign({
  id
}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  //Remove password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  })
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    surname: req.body.surname,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  //1. check if email and password exist
  if (!email || !password) return next(new AppError("Please provide email and password", 400));

  //2. Check if the user exists and password is correct
  const user = await User.findOne({
    email
  }).select("+password");

  if (!user || !await (user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }
  //2. Validate the token/ verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //async 

  //3. Check if user still exists 
  const currentUser = await User.findById(decoded.id); //To check if the user still exists

  if (!currentUser) {
    return next(new AppError("The user belonging to the token no longer exists.", 401));
  }

  //4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401));
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//wrapper function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ["admin", "tutor"], role = "student"
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403)); //forbidden
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on Posted email
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  //2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false
  });

  //3. Send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

    // await sendEmail({ 
    //   // email: user.email,
    //   email: req.body.email,
    //   subject: "Your password reset token (valid for 10 mins)",
    //   message
    // });

    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Token sent to email"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false
    });
    // the try catch block to do more
    return next(new AppError("There was an error sending the email. Try again later", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  }); //acutally token is the only thing we have about the user right now, no email and all that //b. putting the expiring into consideration

  //2. If token has not expired, and there is user, set the new password
  //actually if the token has expired, it will return the user
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //validation runs here again. 
  //4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. Get the user from collection
  //since the user is already logged in, get id from JWT but user id on the request object
  const user = await User.findById(req.user.id).select("+password");

  //2. Check if the posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  //3. If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //User.findByIdAndUpdate will NOT work as intended!
  //4. Log User in, Send JWT
  createSendToken(user, 200, res);
});