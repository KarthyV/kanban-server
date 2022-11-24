import express from "express";
import { Users } from "../models/user.model.js";
import {
  createUser,
  loginUser,
  authUser,
  logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/signup", createUser);

router.post("/login", loginUser);

router.post("/auth", authUser);

router.post("/logout", logoutUser);

export default router;
