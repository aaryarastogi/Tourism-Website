import React from "react";
import flights from "./data";

const Flights = () =>{
    return(
        <div>
        {
            flights.map((item,index)=>(
                <div className='flex md:flex-col flex-row bg-white drop-shadow-lg w-auto rounded-md mx-6 my-2 pl-6 pt-10 cursor-pointer' >
                <div className="flex flex-row ">
                <img src={item.image1} className="w-36 h-36 rounded-md"></img>
                    <div className="ml-4 space-y-1">
                        <h1 className="text-start text-gray-600 font-semibold text-md">{item.title}</h1>
                        <h1 className="text-start font-bold text-xl">{item.para}</h1>
                        <hr className="w-16 bg-blue-500"/>
                        <h1 className="text-start text-gray-600 text-md">{item.secondpara}</h1>
                    </div>
                </div>
                <h1 className="text-blue-400 hover:text-blue-600 uppercase font-semibold ml-auto mt-8 my-2 mr-2 cursor-pointer">BOOK NOW</h1>
                </div>
            ))}
        </div>
    )
}

export default Flights