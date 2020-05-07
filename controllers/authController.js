const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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


});