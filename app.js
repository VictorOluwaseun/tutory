const express = require("express");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const app = express();

//ROUTES
app.use("api/v1/users", userRouter);
// app.use("api/v1/subjects");
// app.use("api/v1/categories");
// app.use("api/v1/lessons");

app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this sever!`, 404)));

module.exports = app;