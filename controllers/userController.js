const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// const upload = multer({
//   dest: "public/img/users"
// });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .jpeg({
      quality: 90
    })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. create error is user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword", 400));
  }
  //2. Update user document
  //Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "tutor") {
    if (req.body.role !== "tutor" && req.body.role !== "student") {
      return (next(new AppError("No permission, Invalid input: " + req.body.role, 403)));
    }

    if (req.body.role === "tutor" && req.user.role === "student") {
      next(new AppError("You do not have permission to perform this action", 403));
    }

    req.body.school = req.user.school;

    const {
      surname,
      firstname,
      uid,
      photo,
      role,
      password,
      passwordConfirm,
      passwordChangedAt,
      uClass,
      subject,
      school
    } = req.body;

    const newUser = await User.create({
      surname,
      firstname,
      uid,
      photo,
      role,
      password,
      passwordConfirm,
      passwordChangedAt,
      uClass,
      subject,
      school
    });

    res.status(200).json({
      status: "success",
      data: newUser
    })
  }
});