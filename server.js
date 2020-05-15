const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env"
});

const app = require("./app");

mongoose.connect(
  // process.env.DATABASE_LOCAL, {
  process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log("DB connection successful"));


const PORT = process.env.PORT;
const HOSTNAME = process.env.LOCAL_SERVER

app.listen(PORT, "127.0.0.1", () => console.info("Server has started!"));