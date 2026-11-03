const express = require("express");
const mongoose = require("mongoose");
const Group = require("../models/Group");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

const canManageGroup = (group, user) => (
  user.role === "admin" ||
  group.createdBy.toString() === user._id.toString()
);

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      createdBy: req.user._id,
      members: [req.user._id]
    });
    await group.populate("members", "username email role");
    if (req.user.role === "user") {
      await User.updateOne({ _id: req.user._id }, { $set: { role: "groupAdmin" } });
    }
    res.status(201).json(group);
  } catch (error) {
    console.error("Group creation failed:", error.message);
    res.status(500).json({ message: "Failed to create group" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot view these groups" });
    }
    const groups = await Group.find({ members: req.params.userId })
      .populate("members", "username email role")
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    console.error("Group loading failed:", error.message);
    res.status(500).json({ message: "Failed to load groups" });
  }
});

router.post("/:groupId/members", async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!mongoose.isValidObjectId(req.params.groupId) ||
        !mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ message: "A valid group and member are required" });
    }
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!canManageGroup(group, req.user)) {
      return res.status(403).json({ message: "Only a group administrator can add members" });
    }
    if (!await User.exists({ _id: memberId })) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!group.members.some((id) => id.toString() === memberId)) {
      group.members.push(memberId);
      await group.save();
    }
    await group.populate("members", "username email role");
    req.app.get("io").to(`user:${memberId}`).emit("group_membership_updated", {
      groupId: group._id.toString(),
      action: "added"
    });
    res.json(group);
  } catch (error) {
    console.error("Adding group member failed:", error.message);
    res.status(500).json({ message: "Failed to add group member" });
  }
});

router.delete("/:groupId/members/:memberId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.groupId) ||
        !mongoose.isValidObjectId(req.params.memberId)) {
      return res.status(400).json({ message: "A valid group and member are required" });
    }
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!canManageGroup(group, req.user) &&
        req.user._id.toString() !== req.params.memberId) {
      return res.status(403).json({ message: "Only a group administrator can remove members" });
    }
    if (group.createdBy.toString() === req.params.memberId) {
      return res.status(400).json({ message: "The group owner cannot be removed" });
    }

    group.members = group.members.filter(
      (id) => id.toString() !== req.params.memberId
    );
    await group.save();
    req.app.get("io").in(`user:${req.params.memberId}`)
      .socketsLeave(req.params.groupId);
    await group.populate("members", "username email role");
    req.app.get("io").to(`user:${req.params.memberId}`)
      .emit("group_membership_updated", {
        groupId: group._id.toString(),
        action: "removed"
      });
    res.json(group);
  } catch (error) {
    console.error("Removing group member failed:", error.message);
    res.status(500).json({ message: "Failed to remove group member" });
  }
});

router.delete("/:groupId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.groupId)) {
      return res.status(400).json({ message: "A valid group is required" });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!canManageGroup(group, req.user)) {
      return res.status(403).json({ message: "Only the group owner or an administrator can delete this group" });
    }

    await Message.deleteMany({ chatRoom: group._id.toString() });
    await Group.deleteOne({ _id: group._id });

    const io = req.app.get("io");
    const memberIds = group.members.map((id) => id.toString());
    memberIds.forEach((memberId) => {
      io.to(`user:${memberId}`).emit("group_deleted", {
        groupId: group._id.toString(),
        groupName: group.name
      });
    });
    await io.in(group._id.toString()).socketsLeave(group._id.toString());

    res.json({ message: "Group and its messages deleted", groupId: group._id });
  } catch (error) {
    console.error("Group deletion failed:", error.message);
    res.status(500).json({ message: "Failed to delete group" });
  }
});

module.exports = router;
