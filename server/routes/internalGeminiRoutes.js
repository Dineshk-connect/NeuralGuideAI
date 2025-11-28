// server/routes/internalGeminiRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { verifyServiceKey } from "../middleware/verifyServiceKey.js";

dotenv.config();
const router = express.Router();

// Internal endpoint for other trusted services to request an LLM reply.
// Body: { prompt: string, model?: string }
// Protected by SERVICE_KEY header: x-service-key
router.post("/ask", verifyServiceKey, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: "Prompt required" });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured on DevMentor" });
    }

    const systemPreface = `You are a senior developer AI assistant. Respond concisely and clearly. Provide fixes when needed.`;
    const payload = {
      contents: [{ parts: [{ text: `${systemPreface}\n\n${prompt}` }] }],
    };

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 15000,
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return res.json({ reply });
  } catch (error) {
    console.error("❌ Internal Gemini call error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    return res.status(status).json({
      error:
        error.response?.data?.error?.message ||
        "Failed to fetch Gemini response from DevMentor",
    });
  }
});

export default router;
