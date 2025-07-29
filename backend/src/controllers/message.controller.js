import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean(); // make it editable JS object

    // ✅ Check which messages are deleted for current user
    const updatedMessages = messages.map((msg) => {
      const isDeletedForUser = msg.deletedFor?.some(
        (id) => id.toString() === userId.toString()
      );

      return {
        ...msg,
        isDeletedForUser,
      };
    });

    res.status(200).json(updatedMessages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // message ID
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only allow sender or receiver to delete
    const isAuthorized = 
      message.senderId.toString() === userId.toString() || 
      message.receiverId.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({ error: "Not authorized to delete" });
    }

    // Delete for both (hard delete from DB)
    await message.deleteOne();

    res.status(200).json({ message: "Message deleted for both users" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
