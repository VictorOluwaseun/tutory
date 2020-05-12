const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
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


exports.getAllTutors = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "role";
  req.query.role = {
    ne: "student"
  };
  next();
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //BUILD THE QUERY

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //EXECUTE THE QUERY
  const users = await features;

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      data: users
    }
  })
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. create error is user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword", 400));
  }
  //2. Update user document
  //Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "surname", "firstName", "title", "email", "category", "subject");
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  //This is restricted to admin
  const newUser = await User.create(req.body); //Admin can make anyone an admin provided user is not a student
  res.status(200).json({
    status: "success",
    data: newUser
  })
});