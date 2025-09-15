import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import train from '../../Images/train.png'
import NoBookings from "./NoBookings";
import { baseUrl } from "../../HelperUrl/Helper";
import DeleteIcon from '@mui/icons-material/Delete';

const TrainsTrips=()=>{
    const[token,setToken]=useState('');
    const[trains,setTrains]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${baseUrl}/trainbooking`, {
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
            const response = await axios.delete(`${baseUrl}/trainbooking/${trainId}`, {
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
        <>
            {
                trains.length>0 ? (
                    trains.map((tr,idx)=>(
                        <div className="grid grid-cols-2 justify-around py-24">
                            <div className="flex flex-row">
                                <img src={train} className="w-80 mx-4 my-10 rounded-md"></img>
                                <div className="text-start my-20" key={idx}>
                                    <h1 className="text-xl font-semibold text-gray-600 font-serif">From : <span>{tr.fromCity}</span></h1> 
                                    <h1 className="text-xl font-semibold text-gray-600 font-serif">To : <span>{tr.destination}</span></h1> 
                                    <h1 className="text-xl font-semibold text-gray-600 font-serif">Train : <span>{tr.trainNumber}</span></h1> 
                                    <h1 className="text-xl font-semibold text-gray-600 font-serif">Timing Details : <span>{tr.travelDate}</span></h1>
                                    <h1 className="text-xl font-semibold text-gray-600 font-serif">Class : <span>{tr.seatingClass}</span></h1>
                                </div> 
                            </div>
                            <button className="p-2 w-10 h-10 rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95 active:bg-red-700"
                            onClick={()=> handleDelete(tr._id)}
                            >
                                <DeleteIcon/>
                            </button>    
                        </div>     
                    ))
                ):(
                    <NoBookings/>
                )
            }                   
        </>
    )
}

export default TrainsTrips;