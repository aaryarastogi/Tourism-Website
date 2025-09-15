import React, { useEffect, useState } from "react";

//components
import FlightsTrips from "./FlightsTrips";
import TrainsTrips from "./TrainsTrips";
import HotelsTrips from "./HotelsTrips";
import CabsTrips from "./CabsTrips";


const MyTrips=()=>{

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
        <div className="w-full h-auto">
            <h1 className="text-2xl mt-4 text-gray-600 font-semibold font-serif	">Booking Details</h1>
            
            <ul className='flex flex-row justify-around space-x-4 py-8'>
              <li className='border-[1px] border-white text-white cursor-pointer py-2 px-4 rounded-md hover:shadow-md hover:border-tr-2 hover:border-blue-400 hover:text-headingcolor' onClick={handleFlights}>Flights</li>
              <li className='border-[1px] border-gray-200 text-gray-200 cursor-pointer py-2 px-4 rounded-md hover:shadow-md hover:border-tr-2 hover:border-blue-400 hover:text-headingcolor' onClick={handleTrains}>Trains</li>
              <li className='border-[1px] border-gray-200 text-gray-200 cursor-pointer py-2 px-4 rounded-md hover:shadow-md hover:border-tr-2 hover:border-blue-400 hover:text-headingcolor' onClick={handleHotels}>Hotels</li>
              <li className='border-[1px] border-gray-200 text-gray-200 cursor-pointer py-2 px-4 rounded-md hover:shadow-md hover:border-tr-2 hover:border-blue-400 hover:text-headingcolor' onClick={handleCabs}>Cabs</li>
            </ul>

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
    )
}

export default MyTrips;