const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const subjectRouter = require("./routes/subjectRoutes");
const lessonRouter = require("./routes/lessonRoutes");
const registerRouter = require("./routes/registerRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const app = express();


//middlewares
app.use(express.json());

app.use(cors());

//ROUTES
app.use("api/v1/users", userRouter);
app.use("api/v1/categories", categoryRouter);
app.use("api/v1/subjects", subjectRouter);
app.use("api/v1/lessons", lessonRouter);
app.use("api/v1/register", registerRouter);

app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this sever!`, 404)));

//GLobal error middleware
app.use(globalErrorHandler);
module.exports = app;