import { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import chatbot from "../../Images/chatbot.png"
import backend_url from "../../config";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 I’m your travel assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  function getUserEmail() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.user.email || null; 
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    const email = getUserEmail();
    console.log(email);

    try {
      const res = await axios.post(`${backend_url}/api/chat`, {
        prompt: input,
        email: email
      });

      const botReply = res.data.reply || "Sorry, I didn’t understand that.";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: err.response.data.reply }]);
    }
    setInput("");
  };

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-xl text-white hover:scale-110 transition-transform duration-300"
          title="Chat with us"
        >
          <MessageCircle size={28} />
        </button>
      )}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white/90 z-50 shadow-2xl rounded-2xl flex flex-col border animate-[fadeIn_0.3s_ease-in-out]">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex justify-between items-center rounded-t-2xl shadow-md">
            <div className="flex items-center gap-2">
              <img src={chatbot} alt="Bot" className="w-6 h-6 rounded-full" />
              <span className="font-semibold">Travel Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 rounded-full p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`px-3 py-2 rounded-2xl text-sm shadow-md animate-[fadeInUp_0.3s_ease-in-out] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex border-t bg-white rounded-b-2xl">
            <input
              className="flex-1 px-3 py-2 text-sm rounded-bl-2xl outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-white rounded-br-2xl"
            >
              🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
