const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const morgan = require("morgan");


const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const subjectRouter = require("./routes/subjectRoutes");
const lessonRouter = require("./routes/lessonRoutes");
const registerRouter = require("./routes/registerRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const app = express();


//middlewares
// app.use(cors());

//Set security HTTP headers
app.use(helmet()); //securing the http / https headers

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json({
  limit: "10kb"
}));

app.use(express.urlencoded({
  extended: true, // to parse some complex data
  limit: "10kb"
})); //The way that form sends data to the server is also called urlencoded
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(req.query);
//   next()
// })


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss()); //this cleans any user input from malicious HTML code basically

// Prevent parameter pollution
app.use(hpp({
  whitelist: ["surname", "firstName", "category", "role"]
}));

app.use(compression()); //To compress the request objects coming from the client


//ROUTES
// app.use("/", userRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/registers", registerRouter);

app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this sever!`, 404)));

//GLobal error middleware
app.use(globalErrorHandler);
module.exports = app;