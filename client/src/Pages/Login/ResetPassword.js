import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import backend_url from "../../config";

const ResetPassword = () => {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: "", type: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (input.newPassword !== input.confirmPassword) {
            setStatus({ message: "Passwords do not match", type: "error" });
            return;
        }

        setLoading(true);
        setStatus({ message: "", type: "" });

        try {
            const res = await axios.post(
                `${backend_url}/forget-password/${id}/${token}`,
                input
            );
            if(res.status === 200){
                setStatus({ message: res.data.message || "Password reset successful", type: "success" });
            }
            // Redirect to sign-in after a delay
            setTimeout(() => {
                navigate("/signin");
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Reset failed";
            setStatus({ message: errorMsg, type: "error" });
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
                    Set a new password
                </h1>
                <p className="text-gray-600 text-center">
                    Choose a strong password you haven’t used before on myjourney.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 text-left pb-2">
                            New password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            name = "newPassword"
                            value={input.newPassword}
                            onChange={(e) => setInput({...input, 
                                [e.target.name]: e.target.value
                            })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 text-left pb-2">
                            Confirm new password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={input.confirmPassword}
                            name = "confirmPassword"
                            onChange={(e) => setInput({
                                ...input, [e.target.name] : e.target.value
                            })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || input.newPassword === "" || input.confirmPassword === ""}
                        className="w-full py-2 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-70"
                    >
                        {loading ? "Updating..." : "Update password"}
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
                <div className="text-center text-sm text-gray-500">
                    <Link to="/signin" className="text-indigo-600 font-semibold">
                        Back to sign in
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ResetPassword;