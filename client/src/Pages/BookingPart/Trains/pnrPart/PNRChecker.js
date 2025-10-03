import React, { useState } from "react";
import axios from "axios";
import { Button , styled } from "@mui/material"
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

function PNRChecker({onPnrResult , onPnrError}) {
  const [pnr, setPnr] = useState("");
  const [error, setError] = useState("");

  const checkPNR = async () => {
    try {
      setError("");
      const res = await axios.get(`${backend_url}/api/pnr/${pnr}`);
      onPnrError(null);
      onPnrResult(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        onPnrResult(null);
        onPnrError("PNR not found!")
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div>
        <div className=" p-10 my-10 space-y-4 md:border-2 md:border-gray-300 mx-10 rounded-md">
            <h1 className="text-2xl font-bold text-gray-600">PNR Number</h1>
            <input 
                    className="w-full text-2xl text-gray-500 text-center" 
                    style={{outline:'none'}} 
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}>
            </input>
        </div>
        <StylingButton variant="contained" onClick={checkPNR}>search Train</StylingButton>
    </div>
  );
}

export default PNRChecker;