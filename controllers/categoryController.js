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
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("No category found with that ID", 404)); //If no category found
  res.status(200).json({
    status: "success",
    data: {
      category
    }
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {

});
exports.getAllCategories = catchAsync(async (req, res, next) => {

});
exports.getAllCategories = catchAsync(async (req, res, next) => {

});