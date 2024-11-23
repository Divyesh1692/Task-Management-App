const express = require("express");
require("dotenv").config({ path: "../.env" });
require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
const taskRouter = require("./routes/taskRoutes");
const cors = require("cors");
const app = express();
const Port = process.env.PORT || 5002;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/task", taskRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Task Management App" });
});

module.exports = app;
