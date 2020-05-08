const Register = require("../models/registerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllRegister = catchAsync(async (req, res, next) => {
  const registers = await Register.find();
  if (!registers.length || !registers) return next(new AppError("No registers found", 404));
  res.status(200).json({
    status: "success",
    result: registers.length,
    data: {
      registers
    }
  });
});

exports.getRegister = catchAsync(async (req, res, next) => {
  const register = await Register.findById(req.params.id);
  if (!register) return next(new AppError("No register found with that ID", 404)); //If no register found
  res.status(200).json({
    status: "success",
    data: {
      register
    }
  });
});

exports.createRegister = catchAsync(async (req, res, next) => {
  const newRegister = await Register.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      register: newRegister
    }
  });
});

exports.updateRegister = catchAsync(async (req, res, next) => {
  const register = await Register.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  if (!register) return next(new AppError("No register found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      register
    }
  })
});

exports.deleteRegister = catchAsync(async (req, res, next) => {
  const register = await Register.findByIdAndDelete(req.params.id);
  if (!register) return next(new AppError("No register found with that ID", 404));
  res.status(204).json({
    status: "success"
  })
});