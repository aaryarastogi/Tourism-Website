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
                cabs.map((cb, idx) => (
                    <div className="grid grid-cols-2 justify-around py-24">
                        <div className="flex flex-row" key={idx}>
                            <img src={cab} className="w-80 mx-4 my-10 rounded-md" alt={`Cab ${idx}`} />
                            <div className="text-start my-20">
                                <h1 className="text-xl font-semibold text-gray-600 font-serif">From: <span>{cb.fromCity}</span></h1>
                                <h1 className="text-xl font-semibold text-gray-600 font-serif">To: <span>{cb.destination}</span></h1>
                                <h1 className="text-xl font-semibold text-gray-600 font-serif">PickUp Date: <span>{date}</span></h1>
                                <h1 className="text-xl font-semibold text-gray-600 font-serif">PickUp Time: <span>{cb.pickupTime}</span></h1>
                            </div>
                        </div>
                        <button className="p-2 w-10 h-10 rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95 active:bg-red-700"
                        onClick={()=> handleDelete(cb._id)}
                        >
                            <DeleteIcon/>
                        </button> 
                    </div>
                ))
            ) : (
                <NoBookings/>
            )}     
        </div> 
    )
}

export default CabsTrips;