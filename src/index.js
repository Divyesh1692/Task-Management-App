const express = require("express");
require("dotenv").config({ path: "../.env" });
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
const taskRouter = require("./routes/taskRoutes");
const cors = require("cors");
const app = express();
const Port = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Task Management App" });
});
app.listen(Port, () => {
  console.log("Listening....");
  connectDB();
});

module.exports = app;
