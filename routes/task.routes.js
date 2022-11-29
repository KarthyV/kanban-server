import express from "express";
import {
  addNewTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authorizeAdmin, authorizeUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", authorizeUser, addNewTask);
router.patch("/:id", authorizeAdmin, updateTask);
router.delete("/:id", authorizeAdmin, deleteTask);

export default router;
