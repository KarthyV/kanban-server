import express from "express";
import { Tasks } from "../models/Task.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.find();
    return res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const task = new Tasks(req.body);
    await task.save();
    return res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
