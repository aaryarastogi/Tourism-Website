import React, { useEffect, useState } from "react";
import axios from "axios";

//assets
import flight from '../../Images/flight.png'
import NoBookings from "./NoBookings";
import { baseUrl } from "../../HelperUrl/Helper";
import DeleteIcon from '@mui/icons-material/Delete';

const FlightsTrips=()=>{
    const[token,setToken]=useState('');
    const[flights,setFlights]=useState([]);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${baseUrl}/flightbooking`, {
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
            const response = await axios.delete(`${baseUrl}/flightbooking/${flightId}`, {
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
                    <div className="grid md:grid-cols-2 grid-rows justify-around py-24">
                    {flights.map((fl, index) => (
                            <div className="flex md:flex-row flex-col">
                                <img src={flight} className="md:w-80 w-44 md:mx-4 mx-16 my-10 rounded-md"></img>
                            {
                                fl.category==="Multi City" ? (
                                    <div key={index} className="text-start my-20 md:mx-0 mx-16">
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">1st Trip : <span>From {fl.fromCity} to {fl.destination}</span></h1> 
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">2nd Trip : <span>From{fl.fromCity1}  to {fl.destination1}</span></h1> 
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">Timing Details : <span>{fl.departureDate} to {fl.returnDate}</span></h1>
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">Category : <span>{fl.category}</span></h1>
                                    </div>
                                ):(
                                    <div key={index} className="text-start my-20 md:mx-0 mx-16">
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">From : <span>{fl.fromCity}</span></h1> 
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">To : <span>{fl.destination}</span></h1> 
                                        {
                                            fl.category === "One Way" ? (
                                                <h1 className="text-xl font-semibold text-gray-600 font-serif">Timing Details : <span>{fl.departureDate}</span></h1>
                                            ):
                                            (
                                                <h1 className="text-xl font-semibold text-gray-600 font-serif">Timing Details : <span>{fl.departureDate} to {fl.returnDate}</span></h1>
                                            )
                                        }
                                        <h1 className="text-xl font-semibold text-gray-600 font-serif">Category : <span>{fl.category}</span></h1>
                                    </div>
                                )
                            }
                            <button className="p-2 w-10 h-10 rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95 active:bg-red-700"
                            onClick={()=> handleDelete(fl._id)}
                            >
                                <DeleteIcon/>
                            </button>
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