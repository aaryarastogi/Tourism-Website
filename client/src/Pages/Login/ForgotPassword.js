import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import backend_url from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await axios.post(`${backend_url}/forget-password`, { email });
      setStatus({ message: res.data.message || "If this email exists, a reset link has been sent.", type: "success" });
    } catch (err) {
        console.log("err:", err);
      const msg = err.response?.data?.message || "Error sending reset email";
      setStatus({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full h-auto flex items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center">Enter your email to receive a password reset link.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 text-left pb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || email === ""}
            className="w-full py-2 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {status.message && (
          <div
            className={`p-3 text-sm rounded-lg ${
              status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;