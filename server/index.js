// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import internalGeminiRoutes from "./routes/internalGeminiRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (allow frontend + cookies)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🧠 Debug log for Mongo connection
console.log("🔍 Connecting to MongoDB...");

// ✅ Modern MongoDB connection (Mongoose v7+)
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
})();

// Optional Mongoose event listeners
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose event: connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose connection error:", err);
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/internal/gemini", internalGeminiRoutes);

// ✅ Request logger (optional)
app.use((req, res, next) => {
  console.log("📩", req.method, req.url);
  next();
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
