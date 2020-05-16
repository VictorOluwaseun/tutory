const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
  // server.close(() => { //Server was created because it was needed here 
  //     process.exit(1);
  // });
});

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

const server = app.listen(PORT, () => console.info("Server has started!"));

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => { //Server was created because it was needed here 
    process.exit(1);
  });
});


process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECIEVED. Shutting down properly");
  server.close(() => { //All the pending requests will process until the end
    console.log("💥 Process terminated"); //SIGTERM will case it to shutdown so we do no need process.exit(1)
  });
});