const express = require("express");
const userRouter = require("./src/routes/userRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const taskRouter = require("./src/routes/taskRoutes");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors());

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/task", taskRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Task Management App" });
});

module.exports = app;
