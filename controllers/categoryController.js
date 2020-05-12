const Category = require("../models/categoryModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllCategories = catchAsync(async (req, res, next) => {

  req.query.sort = "name";

  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features;
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

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      category: newCategory
    }
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  if (!category) return next(new AppError("No category found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      category
    }
  })
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError("No category found with that ID", 404));
  res.status(204).json({
    status: "success"
  })
});