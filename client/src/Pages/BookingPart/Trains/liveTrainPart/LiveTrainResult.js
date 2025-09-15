import React from "react";
import { motion } from "framer-motion";

function LiveTrainResult({data}){
    return(
        <div className="flex md:flex-row flex-col gap-8">
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="md:p-6 p-2 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 md:w-[40%]"
        >
        <h3 className="text-xl font-bold text-green-800 mb-4 border-b-2 border-green-300 pb-2">
            🚉 Current Status
        </h3>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm font-semibold">
            <span>{data.train.start_station} (0 km)</span>
            <span>{data.train.end_station} ({data.train.total_km} km)</span>
            </div>
            <div className="relative mt-2 h-2 bg-white/30 rounded-full">
            <div
                className="absolute top-0 left-0 h-2 bg-green-400 rounded-full"
                style={{ width: `${data.progress}%` }}
            />
            </div>
        </div>
        <div
            className={`p-3 mb-4 text-sm rounded-lg flex items-center gap-2 ${
            data.current_status.delay === "On Time"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
        >
            <span className="text-lg">⏱️</span>
            <span>
            {data.current_status.delay === "On Time"
                ? "Train is running on time"
                : `Delay: ${data.current_status.delay}`}
            </span>
        </div>

        <div className="flex flex-col gap-6">
            <div>
            <p className="font-semibold text-gray-800">Origin Station</p>
            <div className="flex justify-between text-sm mt-1 space-y-2">
                <span className="font-bold">{data.train.start_station}</span>
                <span className="text-gray-500">{data.train.origin_time}</span>
            </div>
            <p className="text-green-700 font-semibold">
                DEP - {data.train.start_station} <span className="text-gray-500">(Sch: {data.train.origin_time})</span>
            </p>
            </div>

            <div>
            <p className="font-semibold text-gray-800">Last Station</p>
            <div className="flex justify-between text-sm mt-1 space-y-2">
                <span className="font-bold">{data.train.end_station}</span>
                <span className="text-gray-500">{data.train.end_time}</span>
            </div>
            <p className="text-red-700 font-semibold">
                ETA - {data.train.end_station} <span className="text-gray-500">(Sch: {data.train.end_time})</span>
            </p>
            </div>
        </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:p-6 p-2 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 md:w-[60%]"
        >
            <h3 className="text-xl font-bold text-indigo-800 mb-4 border-b-2 border-indigo-300 pb-2">
            🛤️ Route Progress
            </h3>
            <div className="relative border-l-4 border-indigo-400 md:pl-6">
            {data.route.map((stop, idx) => (
                <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="mb-6"
                >
               <table className="w-full">
                <tr>
                    <td className="md:w-1/4">
                    <div className="flex flex-row items-center gap-2">
                        <div className="md:w-4 md:h-4 w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <p className="font-semibold text-gray-900">{stop.station}</p>
                    </div>
                    </td>
                    <td className="md:w-1/4 text-center">
                    <p className="text-sm text-gray-600">{stop.status} at</p>
                    </td>
                    <td className="md:w-1/3 text-sm text-gray-600">
                    {(() => {
                        if (!stop.time) return "";
                        const [hours, minutes] = stop.time.split(":").map(Number);
                        const suffix = hours >= 12 ? "PM" : "AM";
                        const formattedHours = ((hours + 11) % 12) + 1;
                        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
                    })()}
                    </td>
                    <td className="md:w-1/4 text-right">
                    <p className="text-sm text-gray-600">{stop.km} km</p>
                    </td>
                </tr>
                </table>
                </motion.div>
            ))}
            </div>
        </motion.div>
        </div>
    )
}

export default LiveTrainResult;