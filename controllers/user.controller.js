import { Users } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sessions } from "../models/session.model.js";

const createUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  await bcrypt.hash(password, 10, async (err, hashedPassword) => {
    try {
      const userData = { email, password: hashedPassword };
      const user = new Users(userData);
      const token = jwt.sign(
        { _id: user._id + Date.now() },
        process.env.SECRET
      );
      const sessionData = new Sessions({ userId: user._id, token });
      await user.save();
      await sessionData.save();
      res.status(201).send(sessionData);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "User already exists" });
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send({ message: "Invalid Credentials" });
  bcrypt.compare(password, user.password, async (err, result) => {
    if (!result) res.status(401).send({ message: "Invalid Credentials" }); // NOTE: For not found user, use status code 401
    if (result) {
      const token = jwt.sign({ _id: user.id + Date.now() }, process.env.SECRET);
      const sessionData = new Sessions({ userId: user._id, token });
      await user.save();
      await sessionData.save();
      res.status(200).send(sessionData);
    }
  });
};

const authUser = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await Users.findById(userId);

    if (!user) return res.status(403).send({ message: "Please SignUp" });
    else {
      return res.status(200).send({ isAdmin: user.isAdmin });
    }
  } catch (error) {
    return res.status(400).send(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const expireToken = await Sessions.findOneAndUpdate(
      { token },
      { expired: true },
      { new: true }
    );
    await expireToken.save();
    return res.status(200).send({ message: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
};
export { loginUser, createUser, authUser, logoutUser };
