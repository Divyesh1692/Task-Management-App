const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Overdue"],
  },
  dueDate: { type: Date, required: true },
  createdBy: { type: String },
});

taskSchema.pre("save", function (next) {
  if (new Date() > this.dueDate && this.status === "Pending") {
    this.status = "Overdue";
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
