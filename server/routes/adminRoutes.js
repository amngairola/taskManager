import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkRole } from "./../middleware/checkRole.js";

import {
  deleteTask,
  createProject,
  createTask,
  fetchProjectTasks,
  getDashboardData,
  fetchAllUsers,
  searchTasks,
} from "../controller/adminController.js";

const router = express.Router();

router.use(verifyToken, checkRole("admin"));

router.post("/create/projects", createProject);
router.post("/create/task", createTask);
router.delete("/delete/task/:id", deleteTask);
router.get("/dashboard", getDashboardData);
router.get("/tasks", fetchProjectTasks);
router.get("/getAllusers", fetchAllUsers);
router.get("/tasks/search", searchTasks);

export default router;
