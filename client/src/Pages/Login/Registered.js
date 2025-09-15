import React from "react";
import success from '../../Images/SuccessIcon.png'
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

//styling
const StylingButton=styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    color:'#404575',
    fontWeight:600,
    width:'250px',
    height:'40px',
    "&:hover": {
        color: "#404575",
        backgroundColor:"transparent"
    }
}))

const Registered=()=>{
    return(
        <div className="pt-32 w-full h-screen overflow-hidden">
            <h1 className="text-3xl font-semibold text-headingcolor pb-4">Successfully Registered</h1>
            <div className="flex items-center justify-center">
                <img src={success} className="w-64 text-center" />
            </div>
            <h1 className="text-xl text-gray-600 p-4">You have successfully registered</h1>
            <StylingButton variant="contained"><Link to='/signin'>Login Now</Link></StylingButton>
        </div>
    )
}

export default Registered;