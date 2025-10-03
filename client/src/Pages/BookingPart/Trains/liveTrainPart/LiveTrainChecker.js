import React, { useState } from "react";
import { liveTrainStatus } from "../data"
import { Button , styled } from "@mui/material"
import axios from "axios";
import backend_url from "../../../../config";

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
            <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md p-10">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600 mb-2">Train Number</h1>
                    <select value={trainNumber} placeholder="Select Train No." onChange={handleTrainNumber} className="md:w-auto w-56 h-12 text-md font-semibold capitalize cursor-pointer"> 
                            <option>choose</option>
                            {
                            liveTrainStatus.map((item,index) =>(
                                <option key={index} value={item.number}>{item.number} , {item.name}</option>
                            ))}
                    </select>
                </div>
            </div>
            <StylingButton variant="contained" onClick={getLiveTrainStatus}>search Train</StylingButton>
        </>
    )
}

export default LiveTrainChecker;