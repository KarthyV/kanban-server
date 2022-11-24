import jwt from "jsonwebtoken";
import { Users } from "../models/user.model.js";
import { Sessions } from "../models/session.model.js";

const authorizePasswordChange = async (req, res, next) => {
  try {
    const userToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    if (decodedToken) {
      next();
    } else {
      return res.status(401).send({ message: "Not Authorized" });
    }
  } catch (error) {}
};

export { authorizePasswordChange };
