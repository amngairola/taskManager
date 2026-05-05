import { Router } from "express";

import {
  loginUser,
  register,
  getCurrentUser,
  getProjects,
  getProjectById,
  getTasks,
  updateTask,
} from "../controller/userController.js";

import { verifyToken } from "../middleware/auth.js";

const router = Router();

//  Public Routes
router.post("/register", register);
router.post("/login", loginUser);

//  Protected Routes
router.use(verifyToken);

// Current user
router.get("/current-user", getCurrentUser);

// Projects
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);

// Tasks
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);

export default router;
