import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage } from "../controllers/message.controller.js";
import { addMessageReaction } from "../controllers/reaction.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessage);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/:messageId/reaction", protectRoute, addMessageReaction);
export default router;
