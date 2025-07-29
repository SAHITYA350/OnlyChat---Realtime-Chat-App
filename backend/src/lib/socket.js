import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import GroupMessage from "../models/groupMessage.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Join user to their groups
  socket.on("joinGroups", async (groupIds) => {
    if (Array.isArray(groupIds)) {
      groupIds.forEach((groupId) => {
        socket.join(groupId);
        console.log(`User ${userId} joined group ${groupId}`);
      });
    }
  });

  // Leave group rooms
  socket.on("leaveGroups", (groupIds) => {
    if (Array.isArray(groupIds)) {
      groupIds.forEach((groupId) => {
        socket.leave(groupId);
        console.log(`User ${userId} left group ${groupId}`);
      });
    }
  });

  // Handle group message sending
  socket.on("send-group-message", ({ groupId, message }) => {
    console.log("Group message received:", { groupId, message });
    // Broadcast to all users in the group except sender
    socket.to(groupId).emit("receive-group-message", message);
  });

  // For private message reactions
  socket.on("add-reaction", async ({ messageId, emoji, userId: reactingUserId }) => {
    try {
      const message = await Message.findById(messageId);
      if (message) {
        // Notify both sender and receiver
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        
        const reactionData = { messageId, emoji, userId: reactingUserId };
        
        if (receiverSocketId && message.receiverId.toString() !== reactingUserId) {
          io.to(receiverSocketId).emit("reaction-added", reactionData);
        }
        if (senderSocketId && message.senderId.toString() !== reactingUserId) {
          io.to(senderSocketId).emit("reaction-added", reactionData);
        }
      }
    } catch (error) {
      console.error("Socket reaction error:", error);
    }
  });

  // For group message reactions
  socket.on("add-group-reaction", async ({ messageId, emoji, groupId, userId: reactingUserId }) => {
    try {
      const message = await GroupMessage.findById(messageId);
      if (message) {
        // Notify all group members except the one who reacted
        socket.to(groupId).emit("group-reaction-added", { 
          messageId, 
          emoji, 
          userId: reactingUserId 
        });
      }
    } catch (error) {
      console.error("Socket group reaction error:", error);
    }
  });

  // Handle user leaving group
  socket.on("leave-group", ({ groupId, userId: leavingUserId }) => {
    socket.leave(groupId);
    socket.to(groupId).emit("user-left-group", { groupId, userId: leavingUserId });
  });

  // Handle member being removed from group
  socket.on("member-removed", ({ groupId, removedUserId, adminId }) => {
    const removedUserSocketId = getReceiverSocketId(removedUserId);
    if (removedUserSocketId) {
      io.to(removedUserSocketId).emit("removed-from-group", { groupId, adminId });
    }
    socket.to(groupId).emit("member-removed-from-group", { groupId, removedUserId, adminId });
  });

  // Handle new member added to group
  socket.on("member-added", ({ groupId, newMemberIds, adminId }) => {
    newMemberIds.forEach(memberId => {
      const memberSocketId = getReceiverSocketId(memberId);
      if (memberSocketId) {
        io.to(memberSocketId).emit("added-to-group", { groupId, adminId });
      }
    });
    socket.to(groupId).emit("new-members-added", { groupId, newMemberIds, adminId });
  });

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };