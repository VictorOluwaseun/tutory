const Register = require("../models/registerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const {
  filterUnwanted
} = require("../utils/filterObj");

exports.getAllRegisters = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.user.role === "tutor") {
    filter = {
      tutor: req.user.id
    }
  }

  const registers = await Register.find(filter);
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

// exports.filterBody = catchAsync(async (req, res, next) => {
//   const filteredBody = filterObj(req.body, "qualifications");
//   req.body = filteredBody;
//   next();
// });

exports.filterBody = catchAsync(async (req, res, next) => {
  filterUnwanted(req.body, "tutor", "category", "subject", "approved", "createdAt");
  next();
});

exports.setTutorCategorySubjectId = catchAsync(async (req, res, next) => {
  //To allow nested routes
  if (!req.body.tutor) req.body.tutor = req.user.id;
  if (!req.body.category) req.body.category = req.params.categoryId;
  if (!req.body.subject) req.body.subject = req.params.subjectId;

  console.log(req.params);


  next();
});

exports.createRegister = catchAsync(async (req, res, next) => {
  // req.body.tutor = req.user;
  const newRegister = await Register.create(req.body);
  console.log(req.body);

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