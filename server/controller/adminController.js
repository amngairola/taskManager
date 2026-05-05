import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const project = await Project.create({
    title,
    description,
    createdBy: req.user.id,
    members: members || [],
  });

  res.status(201).json(new ApiRes(201, project, "Project created"));
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate } = req.body;

  if (!title || !projectId) {
    throw new ApiError(400, "Title & projectId required");
  }

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Not allowed");
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    dueDate,
  });

  res.status(201).json(new ApiRes(201, task, "Task created"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) throw new ApiError(404, "Task not found");

  const project = await Project.findById(task.projectId);

  if (!project || project.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Not allowed");
  }

  await task.deleteOne();

  res.json(new ApiResponse(200, null, "Task deleted"));
});

export const getDashboardData = asyncHandler(async (req, res) => {
  const adminId = req.user.id;

  const totalProjects = await Project.countDocuments({
    createdBy: adminId,
  });

  const projects = await Project.find({ createdBy: adminId }).select("_id");
  const projectIds = projects.map((p) => p._id);

  const totalTasks = await Task.countDocuments({
    projectId: { $in: projectIds },
  });

  const taskStats = await Task.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const recentProjects = await Project.find({ createdBy: adminId })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentTasks = await Task.find({
    projectId: { $in: projectIds },
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const dashboardData = {
    totalProjects,
    totalTasks,
    taskStats,
    recentProjects,
    recentTasks,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, "Dashboard data fetched"));
});
