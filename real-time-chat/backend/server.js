require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Message = require("./models/Message");
const User = require("./models/User");
const Group = require("./models/Group");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./db");
const { requireAuthentication, verifyToken } = require("./authentication");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN ||
  "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("This website origin is not allowed by CORS"));
  }
};

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "20kb" }));
app.use("/api/auth", authRoutes);

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Chat backend is running" });
});

app.use("/api", requireAuthentication);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

const roomIsAllowed = async (userId, chatRoom) => {
  if (chatRoom === "general") return true;

  if (chatRoom.startsWith("direct:")) {
    const participants = chatRoom.slice("direct:".length).split(":");
    return participants.length === 2 && participants.every(mongoose.isValidObjectId) &&
      participants.includes(userId) &&
      await User.exists({ _id: { $in: participants } });
  }

  if (!mongoose.isValidObjectId(chatRoom)) return false;
  return Boolean(await Group.exists({ _id: chatRoom, members: userId }));
};

app.get("/api/messages", async (req, res) => {
  try {
    const { chatRoom = "general" } = req.query;
    if (!await roomIsAllowed(req.user._id.toString(), String(chatRoom))) {
      return res.status(403).json({ message: "You do not have access to this conversation" });
    }

    const messages = await Message.find({ chatRoom })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(messages.reverse());
  } catch (error) {
    console.error("Failed to load messages:", error.message);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

io.use((socket, next) => {
  const payload = verifyToken(socket.handshake.auth?.token);
  if (!payload) return next(new Error("Please sign in to use chat"));
  socket.data.userId = payload.id;
  next();
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  socket.join(`user:${userId}`);

  socket.on("join_room", async (chatRoom, acknowledge = () => {}) => {
    try {
      if (!await User.exists({ _id: userId })) {
        return acknowledge({ error: "Please sign in again" });
      }
      if (!await roomIsAllowed(userId, String(chatRoom))) {
        return acknowledge({ error: "You do not have access to this conversation" });
      }
      await socket.join(String(chatRoom));
      acknowledge({ success: true });
    } catch (error) {
      console.error("Joining chat room failed:", error.message);
      acknowledge({ error: "Unable to join this conversation" });
    }
  });

  socket.on("leave_room", (chatRoom) => {
    if (chatRoom) socket.leave(String(chatRoom));
  });

  socket.on("send_message", async (message, acknowledge = () => {}) => {
    try {
      if (!userId || !message || typeof message.text !== "string" ||
          !message.text.trim() || message.text.length > 2000) {
        return acknowledge({ error: "Messages must contain 1 to 2000 characters" });
      }

      const chatRoom = String(message.chatRoom || "general");
      if (!await roomIsAllowed(userId, chatRoom)) {
        return acknowledge({ error: "You do not have access to this conversation" });
      }

      const sender = await User.findById(userId).select("username");
      if (!sender) return acknowledge({ error: "Please sign in again" });

      const savedMessage = await Message.create({
        sender: userId,
        username: sender.username,
        text: message.text.trim(),
        chatRoom
      });

      const roomSockets = await io.in(chatRoom).fetchSockets();
      const hasRecipient = roomSockets.some((roomSocket) => roomSocket.id !== socket.id);
      if (hasRecipient) {
        savedMessage.status = "delivered";
        await savedMessage.save();
      }

      const payload = {
        _id: savedMessage._id,
        sender: userId,
        username: savedMessage.username,
        text: savedMessage.text,
        chatRoom,
        status: savedMessage.status,
        createdAt: savedMessage.createdAt
      };
      io.to(chatRoom).emit("receive_message", payload);
      acknowledge({ success: true });

      const recipientIds = chatRoom.startsWith("direct:")
        ? chatRoom.slice("direct:".length).split(":").filter((id) => id !== userId)
        : chatRoom === "general"
          ? []
          : (await Group.findById(chatRoom).select("members"))?.members
            .map((id) => id.toString()).filter((id) => id !== userId) || [];

      recipientIds.forEach((recipientId) => {
        io.to(`user:${recipientId}`).emit("new_notification", {
          text: `${sender.username} sent you a message`,
          chatRoom,
          createdAt: savedMessage.createdAt
        });
      });
    } catch (error) {
      console.error("Message save failed:", error.message);
      acknowledge({ error: "Failed to send message" });
    }
  });
});

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
