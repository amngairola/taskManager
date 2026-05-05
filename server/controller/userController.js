import { User } from "../models/user.model.js";
import ApiRes from "./../utils/ApiRes.utils.js";
import ApiError from "../utils/apiErr.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "member",
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new ApiRes(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, req.user, "User fetched"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ createdBy: req.user.id }, { members: req.user.id }],
  });

  res.json(new ApiRes(200, projects));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) throw new ApiError(404, "Project not found");

  if (
    project.createdBy.toString() !== req.user.id &&
    !project.members.includes(req.user.id)
  ) {
    throw new ApiError(403, "Access denied");
  }

  res.json(new ApiRes(200, project));
});

export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) throw new ApiError(400, "ProjectId required");

  const tasks = await Task.find({ projectId });

  res.json(new ApiRes(200, tasks));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowed = ["todo", "in-progress", "done"];

  if (!allowed.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!task) throw new ApiError(404, "Task not found");

  res.json(new ApiRes(200, task, "Task updated"));
});
