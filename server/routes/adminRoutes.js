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
} from "../controller/adminController.js";

const router = express.Router();

router.use(verifyToken, checkRole("admin"));

router.post("/create/projects", createProject);
router.post("/create/task", createTask);
router.delete("/delete/tasks/:id", deleteTask);
router.get("/dashboard", getDashboardData);
router.get("/tasks", fetchProjectTasks);
router.get("/getAllusers", fetchAllUsers);

export default router;
