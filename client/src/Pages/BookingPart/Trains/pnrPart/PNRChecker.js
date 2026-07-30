import React, { useState } from "react";
import axios from "axios";
import { Button , styled } from "@mui/material"
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

function PNRChecker({onPnrResult , onPnrError}) {
  const { isDark } = useTheme();
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
        <div className={`p-10 my-10 space-y-4 md:border-2 mx-10 rounded-md transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-800/40' : 'border-gray-300 bg-white'}`}>
            <h1 className={`text-2xl font-bold text-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>PNR Number</h1>
            <input 
                    className={`w-full text-2xl text-center focus:outline-none transition-colors duration-200 border-b-2 py-2 ${
                      isDark 
                        ? 'bg-transparent text-white border-indigo-500/50 focus:border-indigo-500' 
                        : 'bg-transparent text-gray-800 border-gray-300 focus:border-indigo-600'
                    }`}
                    value={pnr}
                    placeholder="Enter 10-digit PNR"
                    onChange={(e) => setPnr(e.target.value)}>
            </input>
        </div>
        <StylingButton variant="contained" onClick={checkPNR}>search Train</StylingButton>
    </div>
  );
}

export default PNRChecker;