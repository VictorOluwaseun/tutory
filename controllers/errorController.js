const AppError = require("../utils/AppError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); //400 : Bad request
};

const handleDuplicateFieldsDB = err => {
  // let value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  let value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value}. Please enter another value`;
  //using regular expression to find the texts are within quotes. search-string: regular expression match text between quotes
  // console.log(value);

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again", 401);

const handleJWTExpiredError = () => new AppError("Your token has expired! Please log in again", 401);

// const handleRouteError = () => {
//     return new AppError(`Can't find ${req.originalUrl} on this sever!`, 404);
// };


const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
};

const sendErrorProd = (err, req, res) => {
  //Operation, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error:  leak error details should not be leaked
  //1. Log error
  console.error("ERROR 💥", err);
  //2. Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {
      ...err
    };

    if (!error.message) error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); //selecting code because the error comes mongo driver
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    // if (!error.name) error = handleRouteError();
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);

  }
};