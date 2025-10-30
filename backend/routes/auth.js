import express from "express";
import {
  signup,
  login,
  getUsers,
  createUser,
} from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", authMiddleware, getUsers);
router.post("/", authMiddleware, createUser);

export default router;
