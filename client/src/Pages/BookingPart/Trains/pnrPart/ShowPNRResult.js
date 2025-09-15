import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ShowPNRResult({pnrResult , pnrError}){
    const data = pnrResult;
    const [showPassengers, setShowPassengers] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setShowPassengers(true);
        }, 10000); 
        return () => clearTimeout(timer);
    }, []);

    return(
        <div>
        {
            pnrError ? (
                <div>
                    <h1 className="text-xl text-red-500">{pnrError}</h1>
                </div>
            )
            : pnrResult ? (
                <div className="flex justify-center items-center bg-transparent py-10">
                    <div className="bg-transparent shadow-lg rounded-2xl p-6 w-[80%]">
                        {/* Common PNR Info */}
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                        PNR Status
                        </h2>
                        <p className="text-center text-gray-600 mb-2">PNR: {data.pnr}</p>
                        <p className="text-center text-gray-600 mb-4">
                        Date of Journey: {data.doj}
                        </p>

                        {/* AnimatePresence ensures smooth transition */}
                        <div className="flex flex-row justify-between">
                        <AnimatePresence mode="wait">
                            <motion.div
                            key="train"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8 }}
                            className="bg-blue-100 w-[45%] p-8 rounded-xl shadow-inner"
                            >
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                Train Details
                            </h3>
                            <p>
                                <span className="font-semibold">Train:</span>{" "}
                                {data.train.name} ({data.train.number})
                            </p>
                            <p>
                                <span className="font-semibold">From:</span>{" "}
                                {data.from_station.name}
                            </p>
                            <p>
                                <span className="font-semibold">To:</span>{" "}
                                {data.to_station.name}
                            </p>
                            </motion.div>
                                
                            <motion.div
                            key="passengers"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8 }}
                            className="bg-green-100 w-[45%] p-8 rounded-xl shadow-inner"
                            >
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                                Passenger Details
                            </h3>
                            {data.passengers.map((p) => (
                                <div
                                key={p._id}
                                className="border-b last:border-none py-2 flex justify-between text-gray-700"
                                >
                                <span>Passenger {p.no}</span>
                                <span>
                                    {p.current_status} (Booked: {p.booking_status})
                                </span>
                                </div>
                            ))}
                            </motion.div>
                        </AnimatePresence>
                        </div>
                    </div>
                </div>
            ) : null
        }
        </div>
    )
}

export default ShowPNRResult;