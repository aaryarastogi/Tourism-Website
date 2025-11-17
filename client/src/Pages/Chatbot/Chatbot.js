import { useState } from "react";
import axios from "axios";
import { MessageCircle, X, Send } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import chatbot from "../../Images/chatbot.png"
import backend_url from "../../config";
import { useTheme } from "../../context/ThemeContext";

export default function ChatBot() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 I'm your travel assistant. How can I help you today?" }
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
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-full shadow-2xl text-white hover:scale-110 transition-all duration-300 z-[9999] hover:shadow-blue-500/50"
          title="Chat with us"
        >
          <MessageCircle size={28} />
        </button>
      )}
      {open && (
        <div className={`fixed bottom-24 sm:bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 md:w-96 h-[500px] sm:h-96 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} z-[9999] shadow-2xl rounded-2xl flex flex-col border transition-colors duration-300 animate-[fadeIn_0.3s_ease-in-out]`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex justify-between items-center rounded-t-2xl shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src={chatbot} alt="Bot" className="w-8 h-8 rounded-full border-2 border-white/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base">Travel Assistant</span>
                <span className="text-xs text-white/80">Online</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
              title="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-[fadeInUp_0.3s_ease-in-out]`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <img src={chatbot} alt="Bot" className="w-4 h-4 rounded-full" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                      msg.sender === "user"
                        ? `bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none ${isDark ? 'shadow-blue-500/30' : ''}`
                        : `${isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'} rounded-bl-none ${isDark ? 'shadow-gray-800/50' : 'shadow-gray-200'}`
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className={`flex items-center gap-2 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-3 rounded-b-2xl transition-colors duration-300`}>
            <input
              className={`flex-1 px-4 py-2.5 text-sm rounded-xl outline-none transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:border-indigo-500' 
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:border-indigo-500'
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                input.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
              }`}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
