const express = require("express");
const app = express();

//ROUTES
app.use("api/v1/users")
app.use("api/v1/subjects")
app.use("api/v1/categories")
app.use("api/v1/lessons")