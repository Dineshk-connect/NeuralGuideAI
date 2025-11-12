import React, { useState } from "react";
import axios from "axios";

const RoadmapGenerator = () => {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      // ✅ concise, structured prompt (less tokens)
      const prompt = `
Create a concise learning roadmap for becoming a ${goal}.
Keep the answer short and structured like this:
1️⃣ **Phase Name** — short description (max 15 words)
   • Key Topics (3–4 only)
   • Duration: ~X weeks
   • Mini Project Idea (one line)
Limit the total to 4–6 phases only.
Do NOT add introductions or summaries.
      `.trim();

      const res = await axios.post(
        "http://localhost:5000/api/gemini/ask",
        { prompt },
        { withCredentials: true }
      );

      // 🧩 Trim overly long responses (safety)
      let output = res.data.reply || "";
      if (output.length > 2500) {
        output = output.slice(0, 2500) + "\n\n⚠️ (Response truncated for brevity)";
      }

      setRoadmap(output);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setRoadmap("⚠️ Failed to generate roadmap. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        🎓 DevMentor — AI Roadmap Generator
      </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., MERN Stack Developer, AI Engineer, etc."
          className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
        />

        <button
          onClick={generateRoadmap}
          disabled={loading}
          className={`mt-4 px-5 py-2 rounded-md w-full ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>

        {roadmap && (
          <div className="mt-4 bg-gray-700 p-4 rounded-md whitespace-pre-wrap text-gray-100 text-sm">
            {roadmap}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerator;
