const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env"
});

mongoose.connect(
  process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log("DB connection successful"));


const PORT = process.env.PORT;
const HOSTNAME = process.env.LOCAL_SERVER

app.listen(PORT, "127.0.0.1", () => console.info("Server has started!"));