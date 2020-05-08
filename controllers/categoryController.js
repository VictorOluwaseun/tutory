const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllCategories = catchAsync(async (req, res, next) => {

  const categories = await Category.find();
  if (!categories.length || !categories) return next(new AppError("No categories found", 404));
  res.status(200).json({
    status: "success",
    result: categories.length,
    data: {
      categories
    }
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {

});
exports.getAllCategories = catchAsync(async (req, res, next) => {

});
exports.getAllCategories = catchAsync(async (req, res, next) => {

});
exports.getAllCategories = catchAsync(async (req, res, next) => {

});