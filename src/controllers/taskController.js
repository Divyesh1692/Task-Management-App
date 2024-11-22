const Task = require("../models/taskSchema");

const getTask = async (req, res) => {
  const user = req.user;
  console.log("getTask");
  console.log("user", user);

  try {
    if (user.role == "admin") {
      let task = await Task.find();
      console.log("task", task);

      if (!task) {
        return res.status(404).send("Task not found");
      }
      return res.status(200).json({ message: "All tasks", task });
    } else {
      let username = user.username;
      console.log("username", username);

      let task = await Task.find({ createdBy: username });
      console.log("task-2" + task);

      if (!task) {
        return res.status(404).send("Task not found");
      }
      return res.status(200).json({ message: "All tasks", task });
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.username
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving task", error });
  }
};

const createTask = async (req, res) => {
  try {
    const userTasks = await Task.find({
      createdBy: req.user.username,
      status: "pending",
    });
    console.log("task1");
    if (req.user.role == "user" && userTasks.length >= 10) {
      return res.status(403).json({
        message: "Task limit exceeded (10 tasks).Please Clear Pending Tasks!!!",
      });
    }

    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      createdBy: req.user.username,
    });

    await task.save();
    console.log("task 2");
    res.status(201).json({ message: "Task created successfully!", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.username
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({ message: "Task updated successfully!", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log("Task deleted" + task);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.username
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }
    console.log(req.user.username + req.user.role);

    let data = await Task.findByIdAndDelete(task.id);
    console.log("deleted");

    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

const sortTask = async (req, res) => {
  try {
    const { status, sortBy, order = "asc", dueBefore, dueAfter } = req.query;

    const query =
      req.user.role == "admin" ? {} : { createdBy: req.user.username };

    if (status) {
      query.status = status;
    }

    if (dueBefore || dueAfter) {
      query.dueDate = {};
      if (dueBefore) query.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) query.dueDate.$gte = new Date(dueAfter);
    }

    const sortCriteria = {};
    if (sortBy) {
      sortCriteria[sortBy] = order == "desc" ? -1 : 1;
    } else {
      sortCriteria.dueDate = 1;
    }

    const tasks = await Task.find(query).sort(sortCriteria);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

module.exports = {
  getTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  sortTask,
};
