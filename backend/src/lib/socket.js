import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-frontend-name.vercel.app", // ✅ Change to your real frontend URL
    ],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // ✅ moved inside
  }

  socket.on("add-reaction", async ({ messageId, emoji, userId: reactingUserId }) => {
    try {
      const message = await Message.findById(messageId);
      if (message) {
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
      console.error("❌ Socket reaction error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
