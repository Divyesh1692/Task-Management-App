const express = require("express");
const {
  getTask,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  sortTask,
} = require("../controllers/taskController");
const protect = require("../middlewares/auth");

const taskRouter = express.Router();

taskRouter.get("/gettask", protect, getTask);
taskRouter.get("/gettask/:id", protect, getTaskById);
taskRouter.post("/create", protect, createTask);
taskRouter.patch("/update/:id", protect, updateTask);
taskRouter.delete("/delete/:id", protect, deleteTask);
taskRouter.get("/sort", protect, sortTask);

module.exports = taskRouter;
