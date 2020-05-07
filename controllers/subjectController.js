const Subject = require("../models/subjectModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllSubjects = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = {
    category: req.params.categoryId
  };
  const subjects = await Subject.find(filter);
  res.status(200).json({
    status: "success",
    result: subjects.length,
    data: {
      subjects
    }
  })
});

exports.getSubject = catchAsync(async (req, res, next) => {

});
exports.createSubject = catchAsync(async (req, res, next) => {

});
exports.updateSubject = catchAsync(async (req, res, next) => {

});
exports.deleteSubject = catchAsync(async (req, res, next) => {

});