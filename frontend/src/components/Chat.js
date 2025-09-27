import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:5000", { auth: { token } });
    socketRef.current = socket;

    socket.on("chat history", (msgs) => setMessages(msgs));
    socket.on("chat message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.disconnect();
  }, []);

  const send = () => {
    if (!text.trim()) return;
    socketRef.current.emit("chat message", text);
    setText("");
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-2xl">
        <h3 className="font-semibold">Group Chat</h3>
        <div className="flex items-center space-x-3">
          <span>{user.username}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${
              m.sender === user.username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl shadow ${
                m.sender === user.username
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <div className="text-sm font-semibold">{m.sender}</div>
              <div>{m.text}</div>
              <div className="text-xs text-gray-700 mt-1">
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex p-3 border-t bg-white rounded-b-2xl">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          onClick={send}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
