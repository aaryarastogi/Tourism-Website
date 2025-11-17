import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import train from '../../Images/train.png'
import NoBookings from "./NoBookings";
import DeleteIcon from '@mui/icons-material/Delete';
import backend_url from "../../config";

const TrainsTrips=()=>{
    const[token,setToken]=useState('');
    const[trains,setTrains]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/trainbooking`, {
                headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    setTrains(response.data.trains);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
      },[])

      const handleDelete=async(trainId)=>{
        try {
            const response = await axios.delete(`${backend_url}/trainbooking/${trainId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setTrains(trains.filter(train => train._id !== trainId));
            }
        } catch (error) {
            console.error('Error deleting train:', error.message);
        }
      }

    return(
        <div className="w-full h-auto">
            {
                trains.length>0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trains.map((tr,idx)=>(
                        <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                            <button 
                                className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                                onClick={()=> handleDelete(tr._id)}
                                title="Delete Booking"
                            >
                                <DeleteIcon/>
                            </button>
                            
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <img src={train} className="w-16 h-16 filter brightness-0 invert" alt="Train"/>
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                    <div className="bg-white/80 rounded-lg p-3 mb-2">
                                        <p className="text-sm text-gray-600 mb-1">Route</p>
                                        <p className="font-bold text-lg text-gray-800">{tr.fromCity} → {tr.destination}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-white/80 rounded-lg p-2">
                                            <p className="text-gray-600 text-xs mb-1">Train</p>
                                            <p className="font-semibold text-gray-800">{tr.trainNumber}</p>
                                        </div>
                                        <div className="bg-white/80 rounded-lg p-2">
                                            <p className="text-gray-600 text-xs mb-1">Class</p>
                                            <p className="font-semibold text-gray-800">{tr.seatingClass}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600"><span className="font-semibold">Travel Date:</span> {tr.travelDate}</p>
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

export default TrainsTrips;