const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


// exports.checkUser 

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