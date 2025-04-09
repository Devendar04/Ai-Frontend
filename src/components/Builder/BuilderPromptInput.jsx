import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";

export function BuilderPromptInput({ onSubmit }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/messages", { message: prompt.trim() });

      if (response.status === 200) {
        onSubmit(response.data.reply || prompt.trim()); // Add AI reply if exists
        setPrompt("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message..."
        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm h-20"
        aria-label="Chat input"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!prompt.trim() || loading}
        className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
}
