import { FormControl, FormControlLabel, Input, InputLabel, MenuItem, Radio, RadioGroup, styled } from "@mui/material";
import Select , {SelectChangeEvent} from "@mui/material/Select";
import React, { useEffect } from "react";
import visa from '../../../Images/visa.png'
import currency from '../../../Images/currency.png'


const Forex=()=>{
    useEffect(() => {
        window.scrollTo(1,1);
      }, []);

    return(
        <div className="w-full h-screen">
            <div className="w-auto bg-white md:mx-32 rounded-md p-10">
                <h1 className="font-semibold md:text-2xl text-md text-gray-600">Get Forex Card & Currency At Your Doorstep.<span className="text-xl text-gray-500">We offer <span className="text-green-600">same-day</span> delivery in 125+ Indian cities</span> </h1>
                <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-y-4 my-10">
                        <div className="flex flex-col md:flex-row border-2 border-gray-600 w-auto p-4 rounded-md">
                            <img src={visa} className="w-32"></img>
                            <div>
                            <div className="flex flex-col text-left ml-4">
                                <h1 className="text-xl font-semibold">Multicurrency Card</h1>
                                <h3>Zero forex mark-up , Accepted in 150+ countries , Up to 5% more savings over Credit/Debit Cards , Offers & cashback</h3>
                            </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row border-2 border-gray-600 w-auto p-4 rounded-md">
                            <img src={currency} className="w-32"></img>
                            <div>
                            <div className="flex flex-col text-left ml-4">
                                <h1 className="text-xl font-semibold">Foreign Currency Notes</h1>
                                <h3>Best rates , 40+ currencies available , Genuine notes100+ RBI-licensed money changers , Offers & cashback</h3>
                            </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Forex;