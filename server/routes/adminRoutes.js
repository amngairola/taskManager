import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

import {
  deleteTask,
  createProject,
  createTask,
} from "./../controller/adminController";

const router = express.Router();

router.use(verifyToken, checkRole("admin"));

router.post("/projects", createProject);
router.post("/tasks", createTask);
router.delete("/tasks/:id", deleteTask);

router.get("/dashboard", getDashboardData);

export default router;
