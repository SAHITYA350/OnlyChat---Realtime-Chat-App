import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members, description } = req.body;
    const adminId = req.user._id;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const membersArray = Array.isArray(members) ? [...members] : [];
    if (!membersArray.includes(adminId.toString())) {
      membersArray.push(adminId.toString());
    }

    // Validate members exist
    const existingMembers = await User.find({ _id: { $in: membersArray } });
    if (existingMembers.length !== membersArray.length) {
      return res.status(400).json({ error: "One or more members not found" });
    }

    const newGroup = new Group({
      name,
      description: description || "",
      admin: adminId,
      members: membersArray,
    });

    await newGroup.save();

    // Populate and return full group data
    const populatedGroup = await Group.findById(newGroup._id)
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic");

    // Notify new members via socket
    membersArray.forEach(memberId => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("new-group", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Get all groups for a user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Get user groups error:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Get messages from group
export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, members: userId });

    if (!group) {
      return res.status(403).json({ error: "Not authorized to view this group" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 })
      .lean();

    const updatedMessages = messages.map((msg) => {
      const isDeletedForUser = msg.deletedFor?.some(id => id.toString() === userId.toString());
      return { ...msg, isDeletedForUser };
    });

    res.status(200).json(updatedMessages);
  } catch (error) {
    console.error("Get group messages error:", error);
    res.status(500).json({ error: "Failed to fetch group messages" });
  }
};

// Send group message
export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const groupId = req.params.id;
    const senderId = req.user._id;

    const group = await Group.findOne({ _id: groupId, members: senderId });

    if (!group) {
      return res.status(403).json({ error: "Not authorized to send messages to this group" });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "group_messages",
        quality: "auto",
        fetch_format: "auto"
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await GroupMessage.create({
      groupId,
      senderId,
      text,
      image: imageUrl || null,
    });
    
    const populatedMessage = await GroupMessage.findById(newMessage._id)
      .populate("senderId", "fullName profilePic")
      .lean();

    // Emit to all group members including sender
    io.to(groupId.toString()).emit("newGroupMessage", {
      ...populatedMessage,
      groupId: groupId.toString()
    });

    // Update group's last activity
    await Group.findByIdAndUpdate(groupId, { updatedAt: new Date() });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send group message error:", error);
    res.status(500).json({ error: "Failed to send group message" });
  }
};

// Add members to group
export const addGroupMembers = async (req, res) => {
  try {
    let { members } = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;

    if (!Array.isArray(members)) {
      return res.status(400).json({ error: "Members must be an array" });
    }

    const group = await Group.findOne({ _id: groupId, admin: userId });

    if (!group) {
      return res.status(403).json({ error: "Only admin can add members" });
    }

    const existingMembers = await User.find({ _id: { $in: members } });

    if (existingMembers.length !== members.length) {
      return res.status(400).json({ error: "One or more members not found" });
    }

    const newMembers = members.filter(
      (id) => !group.members.map(String).includes(id.toString())
    );

    if (newMembers.length === 0) {
      return res.status(400).json({ error: "No new members to add" });
    }

    group.members.push(...newMembers);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic");

    // Emit socket event to notify about new members
    io.emit("member-added", { 
      groupId: groupId.toString(), 
      newMemberIds: newMembers, 
      adminId: userId.toString() 
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Add group members error:", error);
    res.status(500).json({ error: "Failed to add group members" });
  }
};

// Remove member from group
export const removeGroupMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });

    if (!group) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    if (memberId === userId.toString()) {
      return res.status(400).json({ error: "Admin cannot remove themselves" });
    }

    if (!group.members.includes(memberId)) {
      return res.status(400).json({ error: "User is not a member of this group" });
    }

    group.members = group.members.filter((id) => id.toString() !== memberId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic");

    // Emit socket event to notify about member removal
    io.emit("member-removed", { 
      groupId: groupId.toString(), 
      removedUserId: memberId, 
      adminId: userId.toString() 
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Remove group member error:", error);
    res.status(500).json({ error: "Failed to remove group member" });
  }
};

// Leave group (for members to leave themselves)
export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ error: "You are not a member of this group" });
    }

    if (group.admin.toString() === userId.toString()) {
      return res.status(400).json({ error: "Admin cannot leave group. Transfer admin rights first or delete the group" });
    }

    group.members = group.members.filter((id) => id.toString() !== userId.toString());
    await group.save();

    // Emit socket event
    io.emit("leave-group", { 
      groupId: groupId.toString(), 
      userId: userId.toString() 
    });

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Leave group error:", error);
    res.status(500).json({ error: "Failed to leave group" });
  }
};

// Update group info
export const updateGroup = async (req, res) => {
  try {
    const { name, groupPic } = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });

    if (!group) {
      return res.status(403).json({ error: "Only admin can update group" });
    }

    if (name) group.name = name;

    if (groupPic) {
      const uploadResponse = await cloudinary.uploader.upload(groupPic);
      group.groupPic = uploadResponse.secure_url;
    }

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Update group error:", error);
    res.status(500).json({ error: "Failed to update group" });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });

    if (!group) {
      return res.status(403).json({ error: "Only admin can delete group" });
    }

    // Delete all group messages
    await GroupMessage.deleteMany({ groupId });
    
    // Delete the group
    await group.deleteOne();

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Delete group error:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

// Delete group message
export const deleteGroupMessage = async (req, res) => {
  try {
    const { id } = req.params; // message id
    const userId = req.user._id;
    const { deleteType } = req.query; // "me" or "everyone"

    const message = await GroupMessage.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is member of the group
    const group = await Group.findOne({ _id: message.groupId, members: userId });
    if (!group) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (deleteType === "everyone") {
      // Only sender or admin can delete for everyone
      if (message.senderId.toString() !== userId.toString() && group.admin.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Only sender or admin can delete for everyone" });
      }
      
      await message.deleteOne();
      
      // Emit socket event
      io.to(message.groupId.toString()).emit("groupMessageDeleted", { 
        messageId: id, 
        deleteType: "everyone" 
      });
      
      return res.status(200).json({ message: "Message deleted for everyone" });
    }

    if (deleteType === "me") {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
      return res.status(200).json({ message: "Message deleted for you" });
    }

    res.status(400).json({ error: "Invalid delete type" });
  } catch (error) {
    console.error("Delete group message error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// Transfer admin rights
export const transferAdmin = async (req, res) => {
  try {
    const { newAdminId } = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });

    if (!group) {
      return res.status(403).json({ error: "Only current admin can transfer admin rights" });
    }

    if (!group.members.includes(newAdminId)) {
      return res.status(400).json({ error: "New admin must be a group member" });
    }

    group.admin = newAdminId;
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("admin", "fullName email profilePic")
      .populate("members", "fullName email profilePic");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Transfer admin error:", error);
    res.status(500).json({ error: "Failed to transfer admin rights" });
  }
};