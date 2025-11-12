import React, { useState } from "react";
import axios from "axios";

const CodeAnalyzer = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      // 🧠 concise, structured, token-efficient prompt
      const prompt = `
You are DevMentor, an expert code reviewer.
Analyze the following code and provide a short, structured review:

1️⃣ Summary (2–3 lines)
2️⃣ Potential Issues (if any)
3️⃣ Improvements / Best Practices
4️⃣ Optional: Optimized version (only if necessary)

Avoid long paragraphs or repeating the code.
Code to analyze:
\`\`\`
${code}
\`\`\`
`.trim();

      const res = await axios.post(
        "http://localhost:5000/api/gemini/ask",
        { prompt },
        { withCredentials: true }
      );

      // ✂️ Limit overly long replies (saves tokens)
      let output = res.data.reply || "";
      if (output.length > 2500) {
        output =
          output.slice(0, 2500) + "\n\n⚠️ (Response shortened for brevity)";
      }

      setResult(output);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setResult("⚠️ Error: Failed to analyze code. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        🧠 DevMentor — Code Analyzer
      </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none resize-none"
          rows="10"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`mt-4 px-5 py-2 rounded-md w-full ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>

        {result && (
          <div className="mt-4 bg-gray-700 p-4 rounded-md whitespace-pre-wrap text-gray-100 text-sm">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalyzer;
