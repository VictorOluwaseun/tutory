const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();

//ROUTES
app.use("api/v1/users", userRouter);
// app.use("api/v1/subjects");
// app.use("api/v1/categories");
// app.use("api/v1/lessons");

module.exports = app;