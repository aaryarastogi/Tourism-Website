import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import hotel from '../../Images/hotel.png'
import NoBookings from "./NoBookings";
import DeleteIcon from "@mui/icons-material/Delete";
import backend_url from "../../config";


const HotelsTrips=()=>{
    //managing states
    const[token,setToken]=useState('');
    const[hotels,setHotels]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        console.log('navbar',storedToken);
        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/hotelbooking`, {
                headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    setHotels(response.data.hotels);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
      },[])

      const handleDelete=async(hotelId)=>{
        try {
            const response = await axios.delete(`${backend_url}/hotelbooking/${hotelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setHotels(hotels.filter(hotel => hotel._id !== hotelId));
            }
        } catch (error) {
            console.error('Error deleting hotel:', error.message);
        }
      }

    return(
        <div className="w-full h-auto">
        {
            hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels.map((hl,idx)=>(
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                    <button 
                        className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                        onClick={()=> handleDelete(hl._id)}
                        title="Delete Booking"
                    >
                        <DeleteIcon/>
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <img src={hotel} className="w-16 h-16 filter brightness-0 invert" alt="Hotel"/>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            <div className="bg-white/80 rounded-lg p-3 mb-2">
                                <p className="text-sm text-gray-600 mb-1">Location</p>
                                <p className="font-bold text-lg text-gray-800">{hl.location}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-white/80 rounded-lg p-2">
                                    <p className="text-gray-600 text-xs mb-1">Check-In</p>
                                    <p className="font-semibold text-gray-800">{hl.checkinDate}</p>
                                </div>
                                <div className="bg-white/80 rounded-lg p-2">
                                    <p className="text-gray-600 text-xs mb-1">Check-Out</p>
                                    <p className="font-semibold text-gray-800">{hl.checkoutDate}</p>
                                </div>
                            </div>
                            {hl.price && (
                                <div className="bg-white/80 rounded-lg p-2">
                                    <p className="text-gray-600 text-xs mb-1">Price Per Night</p>
                                    <p className="font-bold text-lg text-purple-600">{hl.price}</p>
                                </div>
                            )}
                            {hl.room && (
                                <p className="text-sm text-gray-600"><span className="font-semibold">Rooms:</span> {hl.room}</p>
                            )}
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

export default HotelsTrips;