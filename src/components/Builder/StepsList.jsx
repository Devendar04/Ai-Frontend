import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Terminal as TerminalIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { BuilderPromptInput } from "./BuilderPromptInput";

const initialChatHistory = [
  {
    id: 1,
    type: "message",
    content: "Create a modern portfolio website with a dark theme",
    timestamp: "2 mins ago",
    isUser: true,
  },
  {
    id: 2,
    type: "build-step",
    title: "Project Setup",
    steps: [
      { name: "Installing dependencies", completed: true },
      { name: "Creating project structure", completed: true },
      { name: "Configuring build tools", completed: false },
    ],
  },
  {
    id: 3,
    type: "shell",
    commands: ["npm install react@latest", "npm install tailwindcss", "npm run dev"],
  },
  {
    id: 4,
    type: "message",
    content: "I've set up the project with React and Tailwind CSS. The development server is now running.",
    timestamp: "1 min ago",
    isUser: false,
  },
];

function ChatMessage({ message }) {
  switch (message.type) {
    case "message":
      return (
        <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}>
          <div className={`max-w-[85%] rounded-lg p-3 ${message.isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"}`}>
            <p className="text-sm">{message.content}</p>
            <span className="text-xs mt-2 block opacity-70">{message.timestamp}</span>
          </div>
        </div>
      );

    case "build-step":
      return (
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">{message.title}</h4>
          <div className="space-y-2">
            {message.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {step.completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-gray-500" />}
                <span className="text-gray-300">{step.name}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "shell":
      return (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TerminalIcon className="h-4 w-4 text-blue-500" />
            <span className="text-white text-sm font-medium">Shell Commands</span>
          </div>
          <div className="font-mono text-sm space-y-1">
            {message.commands.map((cmd, index) => (
              <div key={index} className="text-gray-300">$ {cmd}</div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function StepsList() {
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory.length]); // 👈 Fix: Depend on array length, not entire state

  const addMessage = (message) => {
    const userMessage = {
      id: chatHistory.length + 1,
      type: "message",
      content: message,
      timestamp: "Just now",
      isUser: true,
    };

    setChatHistory((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "message",
          content: "I understand your request. Let me help you with that.",
          timestamp: "Just now",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-gray-900 w-full md:w-72 lg:w-80 p-4 border-r border-gray-800 flex flex-col h-full">
      <div className="flex items-center space-x-2 text-white mb-4">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Chat History</h3>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {chatHistory.map((chat) => (
          <ChatMessage key={chat.id} message={chat} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <BuilderPromptInput onSubmit={addMessage} />
      </div>
    </div>
  );
}
