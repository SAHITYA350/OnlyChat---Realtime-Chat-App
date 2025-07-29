import Message from "../models/message.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// For private messages
export const addMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReactionIndex >= 0) {
      // Remove the reaction if it exists
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Add reaction error:", error);
    res.status(500).json({ error: "Failed to add reaction" });
  }
};

// For group messages
export const addGroupMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await GroupMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReactionIndex >= 0) {
      // Remove the reaction if it exists
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Add group reaction error:", error);
    res.status(500).json({ error: "Failed to add reaction" });
  }
};