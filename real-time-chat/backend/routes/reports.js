const express = require("express");
const Group = require("../models/Group");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Administrator access is required" });
    }

    const [groups, users, messageCount, activity] = await Promise.all([
      Group.find().populate("createdBy", "username email").populate("members", "username email").sort({ createdAt: -1 }),
      User.find().select("username email role createdAt"),
      Message.countDocuments(),
      Message.aggregate([
        { $group: { _id: "$sender", messageCount: { $sum: 1 }, lastActive: { $max: "$createdAt" } } }
      ])
    ]);

    const groupActivity = await Message.aggregate([
      { $group: { _id: "$chatRoom", messageCount: { $sum: 1 }, lastActive: { $max: "$createdAt" } } }
    ]);

    res.json({
      membershipParticipation: groups.map((group) => ({
        group: group.name,
        members: group.members.length,
        memberNames: group.members.map((member) => member.username)
      })),
      groupActivity: groups.map((group) => {
        const stats = groupActivity.find((entry) => entry._id === group._id.toString());
        return {
          group: group.name,
          messages: stats?.messageCount || 0,
          lastActive: stats?.lastActive || null
        };
      }),
      userActivity: users.map((user) => {
        const stats = activity.find((entry) => entry._id.toString() === user._id.toString());
        return {
          username: user.username,
          email: user.email,
          role: user.role,
          messages: stats?.messageCount || 0,
          lastActive: stats?.lastActive || null
        };
      }),
      groupCreation: groups.map((group) => ({
        name: group.name,
        createdBy: group.createdBy?.username || "Unknown",
        createdAt: group.createdAt,
        members: group.members.length
      })),
      totals: {
        users: users.length,
        groups: groups.length,
        messages: messageCount
      }
    });
  } catch (error) {
    console.error("Report generation failed:", error.message);
    res.status(500).json({ message: "Failed to generate reports" });
  }
});

module.exports = router;
