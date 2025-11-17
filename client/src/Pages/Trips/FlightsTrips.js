import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import flight from '../../Images/flight.png'
import NoBookings from "./NoBookings";
import DeleteIcon from '@mui/icons-material/Delete';
import backend_url from "../../config";

const FlightsTrips=()=>{
    const[token,setToken]=useState('');
    const[flights,setFlights]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/flightbooking`, {
                headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    setFlights(response.data.flights);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
      },[])

      const handleDelete = async (flightId) => {
        try {
            const response = await axios.delete(`${backend_url}/flightbooking/${flightId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setFlights(flights.filter(flight => flight._id !== flightId));
            }
        } catch (error) {
            console.error('Error deleting flight:', error.message);
        }
    };

    return(
        <div className="w-full h-auto">
            {
                flights.length>0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flights.map((fl, index) => (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                                <button 
                                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                                    onClick={()=> handleDelete(fl._id)}
                                    title="Delete Booking"
                                >
                                    <DeleteIcon/>
                                </button>
                                
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <img src={flight} className="w-16 h-16 filter brightness-0 invert" alt="Flight"/>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        {
                                            fl.category==="Multi City" ? (
                                                <div className="space-y-2">
                                                    <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">{fl.category}</div>
                                                    <div className="bg-white/80 rounded-lg p-3 mb-2">
                                                        <p className="text-sm text-gray-600 mb-1">1st Trip</p>
                                                        <p className="font-bold text-gray-800">{fl.fromCity} → {fl.destination}</p>
                                                    </div>
                                                    <div className="bg-white/80 rounded-lg p-3 mb-2">
                                                        <p className="text-sm text-gray-600 mb-1">2nd Trip</p>
                                                        <p className="font-bold text-gray-800">{fl.fromCity1} → {fl.destination1}</p>
                                                    </div>
                                                    <div className="flex gap-4 text-sm text-gray-600">
                                                        <span className="font-medium">Departure: {fl.departureDate}</span>
                                                        <span className="font-medium">Return: {fl.returnDate}</span>
                                                    </div>
                                                </div>
                                            ):(
                                                <div className="space-y-2">
                                                    <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">{fl.category}</div>
                                                    <div className="bg-white/80 rounded-lg p-3 mb-2">
                                                        <p className="text-sm text-gray-600 mb-1">Route</p>
                                                        <p className="font-bold text-lg text-gray-800">{fl.fromCity} → {fl.destination}</p>
                                                    </div>
                                                    {
                                                        fl.category === "One Way" ? (
                                                            <p className="text-sm text-gray-600"><span className="font-semibold">Departure:</span> {fl.departureDate}</p>
                                                        ):
                                                        (
                                                            <div className="flex gap-4 text-sm text-gray-600">
                                                                <span className="font-medium">Departure: {fl.departureDate}</span>
                                                                <span className="font-medium">Return: {fl.returnDate}</span>
                                                            </div>
                                                        )
                                                    }
                                                    {fl.flight && (
                                                        <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Flight:</span> {fl.flight}</p>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                    ))}
                    </div>
                ):(
                    <NoBookings/>
                )
            }
        </div>
    )
}

export default FlightsTrips;