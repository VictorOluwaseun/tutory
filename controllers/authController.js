const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  //1. check if email and password exist
  if (!email || !password) return next(new AppError("Please provide ID/email and password", 400));

  //2. Check if the user exists and password is correct
  const user = await User.findOne({
    email
  }).select("+password");

  if (!user || !await (user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect ID/email or password", 401))
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
  res.locals.user = currentUser;
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