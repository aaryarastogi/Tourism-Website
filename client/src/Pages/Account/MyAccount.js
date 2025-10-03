import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ar from '../../Images/AR.jpeg'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import { Button, Popover, Typography, styled } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import backend_url from "../../config";

const MyAccount=()=>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const[username,setUsername]=useState('');
    const[phnNumber,setPhnNumber]=useState();
    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');

        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/user`, {
                headers: {
                Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    console.log('res',response.data);
                    setLogined(true);
                    setUsername(response.data.user.username);
                    setPhnNumber(response.data.user.phoneNumber);
                    setEmail(response.data.user.email);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
        window.scrollTo(1,1);
      },[])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleProfile=()=>{
        const element=document.getElementById("profile");
        if(element){
          element.scrollIntoView({behavior:"smooth"})
        }
    }

    const handleLogout=async()=>{
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${backend_url}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Logout successful:", data.message);
                localStorage.removeItem("token");
                setLogined(false);
                window.location.href = "/signin"; 
            } else {
                console.error("Logout failed:", data.message);
            }
        } catch (err) {
            console.error("Error logging out:", err);
        }
    }

    return(
        <div className="w-full h-screen  bg-gradient-to-tr from-[#FA8BFF] via-[#2BD2FF] to-[#2BFF88]">
            {/* upperpart */}
            <div className="flex flex-row text-gray-800 font-semibold md:ml-32 ml-10">
                <h1 className="pl-4 py-2 border-2 border-black md:w-[11%] w-auto md:ml-10 rounded-md flex flex-row">My Account 
                <span onClick={handleClick} className="cursor-pointer">&nbsp;&nbsp;<KeyboardArrowDownIcon/></span>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                >
                <Link to='/mytrips'>
                    <div className="flex flex-row space-x-4 p-2 bg-gradient-to-tr from-cyan-400 via-cyan-300 to-cyan-600 text-green-800 hover:text-blue-600">
                            <CardTravelIcon className="my-4"/>
                            <div className="flex flex-col">
                                <h1 className="font-semibold">My Trips</h1>
                                <h4>See Booking details , cancel booking , modify booking etc.</h4>
                            </div>
                    </div>
                </Link>
                </Popover>
                </h1>
                <h1 className="text-xl mt-2"><KeyboardArrowRightIcon/></h1>
                <h1 className="text-md mt-3">My Profile</h1>
            </div>
            <div className="flex flex-row md:space-x-32 space-y-4">
            {/* left part */}
            <div className="hidden md:block shadow-md w-auto h-1/2 my-10 ml-24 rounded-md">
                <img src={ar} className="w-32 mt-10 mb-4 mx-24"></img>
                <h1 className="text-2xl font-semibold">{username}</h1>
                <p className="text-md uppercase text-gray-600">Personal Profile</p>
                <ul className="my-4 items-center justify-center mx-10">
                    <li className="cursor-pointer hover:bg-blue-200 p-2 rounded-md font-semibold text-gray-800 text-xl flex flex-row"><AccountCircleIcon onClick={handleProfile}/> &nbsp; &nbsp;Profile</li>
                    <li className="cursor-pointer hover:bg-blue-200 p-2 rounded-md font-semibold text-gray-800 text-xl flex flex-row" onClick={handleLogout}><LogoutIcon/> &nbsp; &nbsp;Logout</li>
                </ul>
            </div>
            <div className="w-auto h-auto text-start p-4 rounded-md shadow-md w-1/2 pr-32" id="profile">
                <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
                <h1 className="text-xl text-gray-600">Basic info, for a faster booking experience</h1>
                <table className="mt-4 text-gray-800 space-y-6">
                    <tr className="flex flex-row space-x-52">
                        <h1 className="uppercase font-semibold">Name</h1>
                        <h1>{username}</h1>
                    </tr>
                    <h1 className="text-2xl font-semibold text-gray-800">Login Details</h1>
                    <h1 className="text-xl text-gray-600">Manage your email address , mobile number</h1>
                    <tr className="flex flex-row space-x-32">
                        <h1 className="uppercase font-semibold">Mobile number</h1>
                        <h1>{phnNumber}</h1>
                    </tr>
                    <tr className="flex flex-row space-x-48">
                        <h1 className="uppercase font-semibold">email id</h1>
                        <h1>{email}</h1>
                    </tr>
                </table>
            </div>
            </div>
        </div>
    )
}

export default MyAccount;