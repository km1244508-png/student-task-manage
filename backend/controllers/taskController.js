const mongoose = require("mongoose");
const Task = require("../models/Task");

// GET /api/tasks  -> return all tasks (newest first)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching tasks" });
  }
};

// POST /api/tasks  -> create a new task
const addTask = async (req, res) => {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (!title) {
      return res.status(400).json({ success: false, message: "Task title cannot be empty" });
    }
    if (title.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Task title cannot exceed 100 characters" });
    }

    const task = await Task.create({ title });
    res.status(201).json({ success: true, message: "Task added successfully", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while adding task" });
  }
};

// DELETE /api/tasks/:id  -> delete a task by its ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully", data: deletedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting task" });
  }
};

// PUT /api/tasks/:id  -> edit task title
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    if (!title) {
      return res.status(400).json({ success: false, message: "Task title cannot be empty" });
    }
    if (title.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Task title cannot exceed 100 characters" });
    }

    const task = await Task.findByIdAndUpdate(id, { title }, { new: true, runValidators: true });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task updated successfully", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating task" });
  }
};

// PATCH /api/tasks/:id  -> toggle completed status (Bonus)
const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({ success: true, message: "Task updated successfully", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating task" });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask, toggleTask };
