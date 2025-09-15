import React from "react";
import { motion } from "framer-motion";
import LiveTrainResult from "./LiveTrainResult";

function ShowLiveTrainStatus({liveResult,liveError}){
    const data = liveResult;

    return(
        <div className="w-full p-10 ">
            {
                liveError ? (
                    <h1 className="text-xl text-red-500">{liveError}</h1>
                )
                : liveResult ? (
                    <LiveTrainResult data={data}/>
                ): null
            }
        </div>
    )
}

export default ShowLiveTrainStatus; 