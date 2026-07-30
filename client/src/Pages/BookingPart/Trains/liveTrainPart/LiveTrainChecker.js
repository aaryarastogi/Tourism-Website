import React, { useState } from "react";
import { liveTrainStatus } from "../data"
import { Button , styled } from "@mui/material"
import axios from "axios";
import backend_url from "../../../../config";
import { useTheme } from "../../../../context/ThemeContext";

const StylingButton=styled(Button)(({ theme }) => ({
    marginLeft:'85%',
    background: '#374151',
    [theme.breakpoints.down('md')]: {
      marginLeft:'65%'
  },
  ":hover":{
    background:'#52525b'
  }
}))

function LiveTrainChecker({onLiveResult, onLiveError}){
    const { isDark } = useTheme();
    const[trainNumber,setTrainNumber]=useState('');
    const handleTrainNumber=(e)=>{
        console.log(e);
        setTrainNumber(e.target.value)
    }
    
    const [liveError, setLiveError] = useState("");

    const getLiveTrainStatus = async () => {
        try {
            const res = await axios.get(`${backend_url}/api/live-train/${trainNumber}`);
            onLiveError(null);
            onLiveResult(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                onLiveResult(null);
                onLiveError("Train status not found!")
            } else {
                setLiveError("Something went wrong. Try again.");
            }
        }
    };

    return (
        <>
            <div className={`my-10 md:border-2 mx-10 rounded-md p-10 transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-800/40' : 'border-gray-300 bg-white'}`}>
                <div className="text-center">
                    <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>Train Number</h1>
                    <select value={trainNumber} placeholder="Select Train No." onChange={handleTrainNumber} 
                            className={`md:w-auto w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 rounded-lg px-4 transition-colors duration-200 focus:outline-none ${
                              isDark 
                                ? 'bg-gray-800 text-white border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-500' 
                                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-indigo-600'
                            }`}> 
                            <option value="">choose</option>
                            {
                            liveTrainStatus.map((item,index) =>(
                                <option key={index} value={item.number} className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>{item.number} , {item.name}</option>
                            ))}
                    </select>
                </div>
            </div>
            <StylingButton variant="contained" onClick={getLiveTrainStatus}>search Train</StylingButton>
        </>
    )
}

export default LiveTrainChecker;