// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import { addGroupMessageReaction } from "../controllers/reaction.controller.js";
// import {
//   createGroup,
//   getUserGroups,
//   getGroupMessages,
//   sendGroupMessage,
//   addGroupMembers,
//   removeGroupMember,
//   updateGroup,
//   deleteGroup,
// } from "../controllers/group.controller.js";

// const router = express.Router();

// router.post("/", protectRoute, createGroup);
// router.get("/", protectRoute, getUserGroups);
// router.get("/:id/messages", protectRoute, getGroupMessages);
// router.post("/:id/messages", protectRoute, sendGroupMessage);
// router.put("/:id/members", protectRoute, addGroupMembers);
// router.delete("/:id/members", protectRoute, removeGroupMember);
// router.put("/:id", protectRoute, updateGroup);
// router.delete("/:id", protectRoute, deleteGroup);
// router.post("/messages/:messageId/reaction", protectRoute, addGroupMessageReaction);

// export default router;

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addGroupMessageReaction } from "../controllers/reaction.controller.js";
import {
  createGroup,
  getUserGroups,
  getGroupMessages,
  sendGroupMessage,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  updateGroup,
  deleteGroup,
  deleteGroupMessage,
  transferAdmin,
} from "../controllers/group.controller.js";

const router = express.Router();

// Group management routes
router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.put("/:id", protectRoute, updateGroup);
router.delete("/:id", protectRoute, deleteGroup);

// Group member management routes
router.put("/:id/members", protectRoute, addGroupMembers);
router.delete("/:id/members", protectRoute, removeGroupMember);
router.post("/:id/leave", protectRoute, leaveGroup);
router.put("/:id/transfer-admin", protectRoute, transferAdmin);

// Group message routes
router.get("/:id/messages", protectRoute, getGroupMessages);
router.post("/:id/messages", protectRoute, sendGroupMessage);
router.delete("/messages/:id", protectRoute, deleteGroupMessage);

// Group message reaction routes
router.post("/messages/:messageId/reaction", protectRoute, addGroupMessageReaction);

export default router;