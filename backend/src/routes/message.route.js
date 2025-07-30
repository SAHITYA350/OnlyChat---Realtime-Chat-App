import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/send/:id", protectRoute, sendMessage);

// ✅ THEN DYNAMIC ROUTES
router.get("/:id", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessage);

export default router;
