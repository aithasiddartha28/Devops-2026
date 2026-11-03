const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot view this profile" });
    }
    const user = await User.findById(req.params.userId)
      .select("username email role contacts")
      .populate("contacts", "username email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("User profile loading failed:", error.message);
    res.status(500).json({ message: "Failed to load user profile" });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = { _id: { $ne: req.user._id } };
    const users = await User.find(filter)
      .select("username email role contacts")
      .sort({ username: 1 });
    res.json(users);
  } catch (error) {
    console.error("User directory loading failed:", error.message);
    res.status(500).json({ message: "Failed to load users" });
  }
});

router.post("/:userId/contacts", async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "You can only manage your own contacts" });
    }
    const { contactId } = req.body;
    if (!mongoose.isValidObjectId(contactId) || contactId === req.params.userId) {
      return res.status(400).json({ message: "Choose another user to add as a contact" });
    }

    const [user, contact] = await Promise.all([
      User.findById(req.params.userId),
      User.findById(contactId)
    ]);
    if (!user || !contact) return res.status(404).json({ message: "User not found" });

    if (!user.contacts.some((id) => id.toString() === contactId)) {
      user.contacts.push(contactId);
      await user.save();
    }
    res.json({ contacts: user.contacts });
  } catch (error) {
    console.error("Adding contact failed:", error.message);
    res.status(500).json({ message: "Failed to add contact" });
  }
});

router.delete("/:userId/contacts/:contactId", async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "You can only manage your own contacts" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.contacts = user.contacts.filter(
      (id) => id.toString() !== req.params.contactId
    );
    await user.save();
    res.json({ contacts: user.contacts });
  } catch (error) {
    console.error("Removing contact failed:", error.message);
    res.status(500).json({ message: "Failed to remove contact" });
  }
});

module.exports = router;
