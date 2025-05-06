import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", authMiddleware, getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;