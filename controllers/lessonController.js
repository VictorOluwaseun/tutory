const Lesson = require("../models/lessonModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllLesson = catchAsync(async (req, res, next) => {
  const lessons = await Lesson.find();
  if (!lessons.length || !lessons) return next(new AppError("No lessons found", 404));
  res.status(200).json({
    status: "success",
    result: lessons.length,
    data: {
      lessons
    }
  });
});

exports.getLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError("No lesson found with that ID", 404)); //If no lesson found
  res.status(200).json({
    status: "success",
    data: {
      lesson
    }
  });
});

exports.bookLesson = catchAsync(async (req, res, next) => {
  req.body.bookedBy = req.user.id;
  const newLesson = await Lesson.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      lesson: newLesson
    }
  });
});

exports.updateLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  if (!lesson) return next(new AppError("No lesson found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      lesson
    }
  })
});

exports.deleteLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) return next(new AppError("No lesson found with that ID", 404));
  res.status(204).json({
    status: "success"
  })
});