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
        <>
        {
            hotels.length > 0 ? (
                hotels.map((hl,idx)=>(
                <div className="grid grid-cols-2 justify-around py-24">
                    <div className="flex flex-row">
                        <img src={hotel} className="w-80 mx-4 my-10 rounded-md"></img>
                        <div className="text-start my-20" key={idx}>
                            <h1 className="text-xl font-semibold text-gray-600 font-serif">Location : <span>{hl.location}</span></h1> 
                            <h1 className="text-xl font-semibold text-gray-600 font-serif">Check-In : <span>{hl.checkinDate}</span></h1> 
                            <h1 className="text-xl font-semibold text-gray-600 font-serif">Check-Out : <span>{hl.checkoutDate}</span></h1>
                            <h1 className="text-xl font-semibold text-gray-600 font-serif">Price : <span>{hl.price}</span></h1>
                        </div>
                    </div>
                    <button className="p-2 w-10 h-10 rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95 active:bg-red-700"
                    onClick={()=> handleDelete(hl._id)}
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

export default HotelsTrips;