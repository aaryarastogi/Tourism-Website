import React from "react";

//assets
import sad from '../../Images/nobookings.png'

const NoBookings=()=>{
    return(
        <div className="flex flex-col items-center justify-center w-full h-auto py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-6">
                <img src={sad} className="md:w-64 w-48"/>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">No Bookings Available</h1>
            <p className="text-gray-500 text-center max-w-md">You haven't made any bookings yet. Start planning your next trip!</p>
        </div>
    )
}

export default NoBookings;