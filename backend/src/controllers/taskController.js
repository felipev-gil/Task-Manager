import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const allTasks = await Task.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });
    if (allTasks.length === 0)
      return res.status(404).json({ message: "Tasks not found" });
    res.status(200).json(allTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const getTask = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!getTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(getTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, content, user, priority, state } = req.body;
    const newTask = new Task({ title, content, user, priority, state });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, state } = req.body;
    const updateTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, priority, state },
      { returnDocument: "after" },
    );
    if (!updateTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const updateTaskState = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { state },
      { returnDocument: "after" },
    );
    if (!updateTaskState)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updateTaskState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archiveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;
    const archivedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { archived },
      { returnDocument: "after" },
    );
    if (!archivedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(archivedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleteTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
