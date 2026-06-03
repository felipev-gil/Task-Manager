import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user.id,
    archived: false,
  });

  res.status(200).json(tasks);
});

export const getTasksArchived = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const search = req.query.search?.trim() || "";

  const query = {
    user: req.user.id,
    archived: true,
    $or: [
      {
        title: { $regex: search, $options: "i" },
      },
      {
        content: { $regex: search, $options: "i" },
      },
    ],
  };

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Task.countDocuments(query),
  ]);

  res.status(200).json({
    tasks,
    currentPage: page,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    totalTasks: total,
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({
    _id: id,
    user: req.user.id,
  });
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, content, priority } = req.body;
  const newTask = new Task({
    title,
    content,
    priority,
    user: req.user.id,
  });
  await newTask.save();
  res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, priority, state } = req.body;
  const updateFields = {};

  if (title !== undefined) updateFields.title = title;

  if (content !== undefined) updateFields.content = content;

  if (priority !== undefined) updateFields.priority = priority;

  if (state !== undefined) updateFields.state = state;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No fields provided");
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id,
    },
    updateFields,
    { returnDocument: "after", runValidators: true },
  );
  if (!updatedTask) throw new ApiError(404, "Task not found");
  res.status(200).json(updatedTask);
});

export const updateTaskState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id,
    },
    { state },
    { returnDocument: "after", runValidators: true },
  );
  if (!updatedTask) throw new ApiError(404, "Task not found");
  res.status(200).json(updatedTask);
});

export const archiveTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;
  const archivedTask = await Task.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id,
    },
    { archived },
    { returnDocument: "after", runValidators: true },
  );
  if (!archivedTask) throw new ApiError(404, "Task not found");
  res.status(200).json(archivedTask);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });
  if (!deletedTask) throw new ApiError(404, "Task not found");
  res.status(200).json({ message: "Task deleted successfully" });
});
