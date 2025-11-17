import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

//components
import FlightsTrips from "./FlightsTrips";
import TrainsTrips from "./TrainsTrips";
import HotelsTrips from "./HotelsTrips";
import CabsTrips from "./CabsTrips";


const MyTrips=()=>{
    const { isDark } = useTheme();
    const[flights,setFlights]=useState(true);
    const[trains,setTrains]=useState(false);
    const[hotels,setHotels]=useState(false);
    const[cabs,setCabs]=useState(false);

    const handleCabs=()=>{
        setCabs(true);
        setFlights(false);
        setTrains(false);
        setHotels(false);
    }

    const handleTrains=()=>{
        setTrains(true);
        setFlights(false);
        setCabs(false);
        setHotels(false);
    }

    const handleHotels=()=>{
        setCabs(false);
        setFlights(false);
        setTrains(false);
        setHotels(true);
    }

    const handleFlights=()=>{
        setCabs(false);
        setFlights(true);
        setTrains(false);
        setHotels(false);
    }


    return(
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">My Bookings</h1>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all your travel bookings in one place</p>
                </div>
            
                {/* Tabs */}
                <div className={`flex flex-wrap gap-3 mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-2 shadow-lg border transition-colors duration-300`}>
                  <button 
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        flights 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                            : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={handleFlights}
                  >
                    ✈️ Flights
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        trains 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105' 
                            : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={handleTrains}
                  >
                    🚂 Trains
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        hotels 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105' 
                            : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={handleHotels}
                  >
                    🏨 Hotels
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        cabs 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105' 
                            : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={handleCabs}
                  >
                    🚗 Cabs
                  </button>
                </div>

                {/* Content */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border p-6 md:p-8 transition-colors duration-300`}>
                    {
                        flights ? (
                            <FlightsTrips/>
                        )
                        : trains ? (
                            <TrainsTrips/>
                        )
                        : hotels ? (
                            <HotelsTrips/>
                        )
                        :(
                            <CabsTrips/>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MyTrips;