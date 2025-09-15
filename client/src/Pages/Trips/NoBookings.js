import React from "react";

//assets
import sad from '../../Images/nobookings.png'

const NoBookings=()=>{
    return(
        <div className="flex flex-col items-center justify-center w-full h-auto">
            <img src={sad} className="md:w-96 w-64"/>
            <h1 className="text-xl font-serif font-semibold text-headingcolor pb-10">No Bookings Available</h1>
        </div>
    )
}

export default NoBookings;