// server/routes/chatRoutes.js
import express from "express";
import Chat from "../models/Chat.js";
import {requireAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new chat session (empty)
router.post("/create", requireAuth, async (req, res) => {
  try {
    const chat = new Chat({ user: req.user.id, title: req.body.title || "Untitled", messages: [] });
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Save a message pair or append message
router.post("/:chatId/message", requireAuth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { role, text } = req.body; // role: 'user' or 'assistant'
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Not found" });
    if (chat.user.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    chat.messages.push({ role, text });
    chat.updatedAt = Date.now();
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all chats for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single chat
router.get("/:chatId", requireAuth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: "Not found" });
    if (chat.user.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
