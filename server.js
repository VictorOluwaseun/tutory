const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env"
});

const PORT = process.env.PORT;
const HOSTNAME = process.env.LOCAL_SERVER

app.listen(PORT, HOSTNAME, () => console.info("Server has started!"));