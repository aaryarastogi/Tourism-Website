import React from "react";
import { Link } from "react-router-dom";

//assets
import flight from '../../Images/airplane.png'
import bus from '../../Images/train.png'
import cabs from '../../Images/cab.png'
import forex from '../../Images/forex.png'
import hotels from '../../Images/hotels.png'

const Options=()=>{
    return(
        <div className="absolute bg-white md:drop-shadow-md md:h-24 h-auto rounded-md lg:-bottom-8 left-1/2 transform -translate-x-1/2 ">
                <div className="md:p-6 p-2 flex flex-row md:space-x-10 space-x-4 justify-around">
                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                        <img src={flight} className="md:w-8 w-6"></img>
                        <h1 className="md:text-xl text-sm hover:text-headingcolor font-semibold"><Link to='/flights'>Flights</Link></h1>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                        <img src={bus} className="md:w-8 w-6"></img>
                        <h1 className="md:text-xl text-sm hover:text-headingcolor font-semibold"><Link to='/trains'>Trains</Link></h1>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                        <img src={hotels} className="md:w-8 w-6"></img>
                        <h1 className="md:text-xl text-sm hover:text-headingcolor font-semibold"><Link to='/hotels'>Hotels</Link></h1>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                        <img src={cabs} className="md:w-8 w-6"></img>
                        <h1 className="md:text-xl text-sm hover:text-headingcolor font-semibold"><Link to='/cabs'>Cabs</Link></h1>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                        <img src={forex} className="md:w-8 w-6"></img>
                        <h1 className="md:text-xl text-sm hover:text-headingcolor font-semibold"><Link to='/forex'>Forex</Link></h1>
                    </div>
                </div>
        </div>
    )
}

export default Options;