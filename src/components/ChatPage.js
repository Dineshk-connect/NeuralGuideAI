import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chats, setChats] = useState([]);

  // ✅ Load existing chat if chatId is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const existingChatId = params.get("chatId");

    if (existingChatId) {
      fetchChat(existingChatId);
      setChatId(existingChatId);
    }
  }, []);

  // 🧠 Fetch chat details
  const fetchChat = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${id}`, {
        withCredentials: true,
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error loading chat:", err.message);
    }
  };

  // 🧠 Create a new chat (only when needed)
  const createChat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/create",
        { title: "New DevMentor Chat" },
        { withCredentials: true }
      );
      setChatId(res.data._id);
      return res.data._id;
    } catch (err) {
      console.error("Chat creation failed:", err.message);
    }
  };

  // 🧠 Handle message send
  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      let currentChatId = chatId;

      // ✅ Create chat only if it doesn't exist
      if (!currentChatId) {
        const newChatId = await createChat();
        if (!newChatId) throw new Error("Failed to create chat");
        currentChatId = newChatId;
        setChatId(newChatId);
      }

      const userMessage = prompt;

      // 1️⃣ Save user message
      await axios.post(
        `http://localhost:5000/api/chat/${currentChatId}/message`,
        { role: "user", text: userMessage },
        { withCredentials: true }
      );

      // 2️⃣ Show user message immediately
      setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
      setPrompt("");

      // 3️⃣ Ask Gemini (with retry + concise prompt)
      const concisePrompt = `
You are DevMentor, an expert AI coding mentor.
Respond concisely, clearly, and directly — no greetings, intros, or summaries.
If the user requests code, include only the essential snippet with short inline notes.
Avoid long paragraphs or explanations unless necessary.

User prompt: ${userMessage}
      `.trim();

      const MAX_RETRIES = 3;
      let geminiRes;
      let lastError = null;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          // 🕓 Show retry status if overloaded
          if (attempt > 1) {
            setMessages((prev) => [
              ...prev,
              {
                role: "system",
                text: `⏳ Gemini overloaded, retrying (${attempt}/${MAX_RETRIES})...`,
              },
            ]);
          }

          geminiRes = await axios.post(
            "http://localhost:5000/api/gemini/ask",
            { prompt: concisePrompt },
            { withCredentials: true }
          );

          if (geminiRes?.data?.reply) break; // ✅ Success
        } catch (err) {
          lastError = err;
          if (err.response?.status === 503 && attempt < MAX_RETRIES) {
            console.warn(`Gemini overloaded, retrying (${attempt})...`);
            await new Promise((r) => setTimeout(r, 2000 * attempt)); // exponential backoff
          } else {
            throw err; // rethrow non-503 errors
          }
        }
      }

      if (!geminiRes?.data?.reply && lastError) throw lastError;

      // 4️⃣ Trim long replies to save tokens
      let aiReply = geminiRes.data.reply || "No response.";
      if (aiReply.length > 3000) {
        aiReply =
          aiReply.slice(0, 3000) +
          "\n\n⚠️ (Response shortened for brevity)";
      }

      // 5️⃣ Save Gemini reply
      await axios.post(
        `http://localhost:5000/api/chat/${currentChatId}/message`,
        { role: "assistant", text: aiReply },
        { withCredentials: true }
      );

      // 6️⃣ Update UI
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: aiReply },
      ]);
    } catch (err) {
      console.error("Chat error:", err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.error ||
        (err.response?.status === 503
          ? "⚠️ Gemini model is overloaded. Please try again later."
          : "⚠️ Error: Failed to connect to DevMentor AI.");

      setMessages((prev) => [...prev, { role: "system", text: errorMsg }]);
    }

    setLoading(false);
  };

  // 🧠 Fetch chat history
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat/", {
        withCredentials: true,
      });
      setChats(res.data);
      setShowHistory(!showHistory);
    } catch (err) {
      console.error("Failed to fetch history:", err.message);
    }
  };

  // 🧠 Open old chat
  const openChat = async (id) => {
    setChatId(id);
    setShowHistory(false);
    fetchChat(id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        💬 DevMentor — Your AI Coding Mentor
      </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat Assistant</h2>
          <button
            onClick={fetchHistory}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-md text-sm"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
        </div>

        {/* Chat History Drawer */}
        {showHistory && (
          <div className="bg-gray-700 p-3 rounded-md mb-4 max-h-48 overflow-y-auto">
            {chats.length === 0 ? (
              <p className="text-gray-400 text-center">No previous chats found.</p>
            ) : (
              <ul>
                {chats.map((chat) => (
                  <li
                    key={chat._id}
                    onClick={() => openChat(chat._id)}
                    className="cursor-pointer hover:bg-gray-600 p-2 rounded-md mb-2"
                  >
                    <span className="text-blue-300 font-semibold">{chat.title}</span>{" "}
                    <span className="text-gray-400 text-sm">
                      ({new Date(chat.updatedAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Chat Window */}
        <div className="h-96 overflow-y-auto bg-gray-700 p-3 rounded-md mb-4">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              Start a conversation with your AI mentor 👇
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                msg.role === "user"
                  ? "text-blue-300"
                  : msg.role === "assistant"
                  ? "text-green-300"
                  : "text-yellow-400"
              }`}
            >
              <b>
                {msg.role === "user"
                  ? "🧑 You: "
                  : msg.role === "assistant"
                  ? "🤖 DevMentor: "
                  : "⚙️ System: "}
              </b>
              <span className="whitespace-pre-wrap">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask your mentor anything..."
          className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none resize-none"
          rows="3"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className={`mt-4 px-5 py-2 rounded-md w-full ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Thinking..." : "Ask DevMentor"}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
