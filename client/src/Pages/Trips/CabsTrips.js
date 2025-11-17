import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import cab from '../../Images/car.png'
import NoBookings from "./NoBookings";
import DeleteIcon from "@mui/icons-material/Delete"
import backend_url from "../../config";

const CabsTrips=()=>{

    const[token,setToken]=useState('');
    const[cabs,setCabs]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/cabbooking`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setCabs(response.data.cabs)
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
      },[])

      var today = new Date(),
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

      const handleDelete=async(cabId)=>{
        try{    
            const response = await axios.delete(`${backend_url}/cabbooking/${cabId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setCabs(cabs.filter(cab=>cab._id !== cabId));
            }
        }catch(e){
            console.log("error in deleting cab...",e.message);
        }
      }

    return(
        <div className="w-full h-auto">
            {
            cabs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cabs.map((cb, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                        <button 
                            className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                            onClick={()=> handleDelete(cb._id)}
                            title="Delete Booking"
                        >
                            <DeleteIcon/>
                        </button>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <img src={cab} className="w-16 h-16 filter brightness-0 invert" alt={`Cab ${idx}`} />
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                <div className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full mb-2">{cb.category || 'Cab Booking'}</div>
                                <div className="bg-white/80 rounded-lg p-3 mb-2">
                                    <p className="text-sm text-gray-600 mb-1">Route</p>
                                    <p className="font-bold text-lg text-gray-800">{cb.fromCity} → {cb.destination}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-white/80 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs mb-1">PickUp Date</p>
                                        <p className="font-semibold text-gray-800">{cb.departureDate || date}</p>
                                    </div>
                                    <div className="bg-white/80 rounded-lg p-2">
                                        <p className="text-gray-600 text-xs mb-1">PickUp Time</p>
                                        <p className="font-semibold text-gray-800">{cb.pickupTime || 'N/A'}</p>
                                    </div>
                                </div>
                                {cb.returnDate && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold">Return Date:</span> {cb.returnDate}</p>
                                )}
                                {cb.dropTime && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold">Drop Time:</span> {cb.dropTime}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <NoBookings/>
            )}     
        </div> 
    )
}

export default CabsTrips;