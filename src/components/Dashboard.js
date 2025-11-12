import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">🚀 DevMentor</h1>
      <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">
        Your personal AI developer mentor — learn, code, and grow smarter with Gemini 2.5 Flash.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Chat Assistant */}
        <Link
          to="/chat"
          className="bg-blue-500 hover:bg-blue-600 px-6 py-4 rounded-xl text-center transition"
        >
          💬 Chat Assistant
        </Link>

        {/* Code Analyzer */}
        <Link
          to="/analyzer"
          className="bg-green-500 hover:bg-green-600 px-6 py-4 rounded-xl text-center transition"
        >
          🧠 Code Analyzer
        </Link>

        {/* Roadmap Generator */}
        <Link
          to="/roadmap"
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-4 rounded-xl text-center transition"
        >
          🎓 Learning Roadmap
        </Link>
      </div>

      {/* About / Info Section */}
      <div className="text-center text-gray-400 text-sm mt-10 max-w-lg">
        <p>
          DevMentor helps you practice coding, debug errors, and plan your learning journey.
        </p>
        <p className="mt-2">
          Powered by <span className="text-blue-400 font-semibold">Gemini 2.5 Flash</span> 🚀
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
