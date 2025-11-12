// server/routes/geminiRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Chat from "../models/Chat.js";
import { requireAuth } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

router.post("/ask/:chatId?", requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const chatId = req.params.chatId;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 🧩 Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // 🧠 Optional: Save user message if chatId provided
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ error: "Chat not found" });
      if (chat.user.toString() !== req.user.id)
        return res.status(403).json({ error: "Forbidden" });

      chat.messages.push({ role: "user", text: prompt });
    }

    // 🧠 System preface + user prompt
    const systemPreface = `You are a senior developer AI assistant. Respond concisely and clearly. Provide fixes when needed.`;
    const payload = {
      contents: [{ parts: [{ text: `${systemPreface}\n\n${prompt}` }] }],
    };

    // ⚡ Make Gemini request
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 15000, // prevent hanging
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // 💾 Save assistant reply
    if (chat) {
      chat.messages.push({ role: "assistant", text: reply });
      chat.updatedAt = Date.now();
      await chat.save();
    }

    return res.json({ reply, chatId: chat?.id });
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);

    // 🧰 Specific error handling
    const status = error.response?.status;

    if (status === 503) {
      return res.status(503).json({
        error: "Gemini model is overloaded. Please try again later.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "Too many requests — please slow down and try again soon.",
      });
    }

    if (status === 400 || status === 401) {
      return res.status(status).json({
        error:
          error.response?.data?.error?.message ||
          "Invalid request or authentication issue with Gemini API.",
      });
    }

    // Generic fallback
    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to fetch Gemini response. Please try again.",
    });
  }
});

export default router;
