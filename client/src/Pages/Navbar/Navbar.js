import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Box, Drawer, Icon, IconButton, Typography, styled } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import {motion} from 'framer-motion'
import { baseUrl } from "../../HelperUrl/Helper";

const StylingButton=styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    color:'#404575',
    fontWeight:600,
    width:'180px',
    height:'40px',
    [theme.breakpoints.down('md')]: {
        width:'140px',
        height:'40px',
    },
    "&:hover": {
        color: "#404575",
        backgroundColor:"transparent"
    }
}))

const IconButtonStyling=styled(IconButton)({
    position:'absolute'
})

const textVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      overflow: 'hidden',
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

const Navbar=(props)=>{

    const[dropdownVisible , setDropdownVisible]=useState(false);
    const [isDrawerOpen,setIsDrawerOpen]=useState(false);
    const [token,setToken]=useState('');
    const[username,setUsername]=useState('');
    const[logined,setLogined]=useState(false);
    const[open,setOpen]=useState(false);

    const handleDiscover=()=>{
        const element=document.getElementById("discover");
        if(element){
          element.scrollIntoView({behavior:"smooth"})
        }
      }

    const handleOffers=()=>{
        const element=document.getElementById("offers");
        if(element){
          element.scrollIntoView({behavior:"smooth"})
          setIsDrawerOpen(false);
        }
      }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const loginState = localStorage.getItem('loginState');
        
        if (storedToken) {
            setToken(storedToken);
        axios.get(`${baseUrl}/user`, {
            headers: {
                'Authorization': `Bearer ${storedToken}`, 
            },
            })
            .then(response => {
                if (response.data.success) {
                    // console.log('Response data:', response.data);
                    setUsername(response.data.user.username);
                    setLogined(true);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
    }, []);

    const handleLogout=async()=>{
        const token = localStorage.getItem("token"); // or sessionStorage.getItem()

        try {
            const res = await fetch("http://localhost:8000/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Logout successful:", data.message);
                localStorage.removeItem("token"); // remove from storage
                setLogined(false);
                window.location.href = "/signin"; // or navigate to login
            } else {
                console.error("Logout failed:", data.message);
            }
        } catch (err) {
            console.error("Error logging out:", err);
        }
    }
    const items = [
    { text: 'Book Flights', link: '/flights' },
    { text: 'Book Hotels', link: '/hotels' },
    { text: 'Book Cabs', link: '/cabs' }
    ];

    return(
        <div className="flex flex-row md:p-6 p-2 justify-between bg-blur md:mx-24 mr-0 rounded-md overflow-hidden">
            <h1 className="flex flex-row font-bold md:text-2xl text-xl cursor-pointer">
                <IconButtonStyling><MenuIcon onClick={()=>setIsDrawerOpen(true)}/></IconButtonStyling>
                <span className="text-headingcolor md:mt-0 mt-1 ml-10"><Link to='/'>myjourney.com</Link></span>
            </h1>
            <Drawer anchor="left" open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)} className="">
                <Box p={2} width='250px' textAlign='left' role='presentation'>
                <motion.h1
                className="text-center font-semibold text-2xl text-headingcolor"
                initial="hidden"
                animate="visible"
                variants={textVariants}
                    >Our Facilities</motion.h1>
                    <div className="mt-4 space-y-2">
                        {
                            logined && (
                                <h1 className="font-normal text-md text-center p-2 hover:bg-blue-100 rounded-md cursor-pointer w-auto px-0 mx-0"><Link to='/mytrips' onClick={()=>setIsDrawerOpen(false)}>My Bookings</Link></h1>
                            )
                        }
                        <motion.h1 
                        initial={{
                            x:-10,
                            y:-10,
                            opacity:0
                        }}
                        whileInView={{ opacity: 1, x:0,y:0}}
                        exit={{
                            opacity:0}}
                        transition={{
                            ease:"easeInOut",
                            duration:1,
                        }} 
                        className="font-normal text-md text-center p-2 hover:bg-blue-100 rounded-md cursor-pointer w-auto px-0 mx-0"><Link to='/' onClick={handleOffers}>Super Offers</Link></motion.h1>
                        {items.map((item, index) => (
                            <motion.h1
                                initial={{
                                    x:-10,
                                    y:-10,
                                    opacity:0
                                }}
                                whileInView={{ opacity: 1, x:0,y:0}}
                                exit={{
                                    opacity:0}}
                                transition={{
                                    ease:"easeInOut",
                                    duration:1,
                                }} 
                                key={index}
                                className="font-normal text-md text-center p-2 hover:bg-blue-100 rounded-md cursor-pointer w-auto px-0 mx-0"
                            >
                                <Link to={item.link} onClick={() => setIsDrawerOpen(false)}>{item.text}</Link>
                            </motion.h1>
                        ))}
                        {
                            logined && (
                                <motion.h1 
                                initial={{
                                    x:-10,
                                    y:-10,
                                    opacity:0
                                }}
                                whileInView={{ opacity: 1, x:0,y:0}}
                                exit={{
                                    opacity:0}}
                                transition={{
                                    ease:"easeInOut",
                                    duration:1,
                                }}  className="font-normal text-md text-center p-2 hover:bg-blue-100 rounded-md cursor-pointer w-auto px-0 mx-0"><Link to='/myprofile' onClick={()=>setIsDrawerOpen(false)}>My Account</Link></motion.h1>
                            )
                        }
                            <motion.h1 
                        initial={{
                            x:-10,
                            y:-10,
                            opacity:0
                        }}
                        whileInView={{ opacity: 1, x:0,y:0}}
                        exit={{
                            opacity:0}}
                        transition={{
                            ease:"easeInOut",
                            duration:1,
                        }}  className="font-normal text-md text-center p-2 hover:bg-blue-100 rounded-md cursor-pointer w-auto px-0 mx-0">Settings</motion.h1>
                    </div>
                </Box>
            </Drawer>
            <div className="space-x-6 flex flex-row">
                <div className="flex flex-col">
                    <h1 className="md:block hidden text-gray-500 hover:text-headingcolor font-semibold mt-2 text-md cursor-pointer" onClick={()=>setDropdownVisible(!dropdownVisible)}>Booking Form</h1>
                    {
                        dropdownVisible && 
                        <div className="flex flex-col shadow-md rounded-md top-2">
                            <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor hover:bg-green-300 rounded-md cursor-pointer" onClick={()=>setDropdownVisible(false)}><Link to='/flights'>Flights</Link></h1>
                            <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor hover:bg-green-300 rounded-md cursor-pointer" onClick={()=>setDropdownVisible(false)}><Link to='/trains'>Trains</Link></h1>
                            <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor hover:bg-green-300 rounded-md cursor-pointer" onClick={()=>setDropdownVisible(false)}><Link to='/hotels'>Hotels</Link></h1>
                            <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor hover:bg-green-300 rounded-md cursor-pointer" onClick={()=>setDropdownVisible(false)}><Link to='/cabs'>Cabs</Link></h1>
                        </div>
                    }
                </div>
                <h1 className="md:block hidden text-gray-500 hover:text-headingcolor font-semibold mt-2 text-md cursor-pointer" onClick={handleDiscover}>Discover</h1>
                <h1 className="md:block hidden text-gray-500 hover:text-headingcolor font-semibold mt-2 text-md cursor-pointer" onClick={()=>setIsDrawerOpen(true)}>Services</h1>
                {
                    logined ? (
                        <div>
                            <h1 className="cursor-pointer font-semibold text-xl mt-1 text-headingcolor" onClick={()=>setOpen(!open)}>{username}</h1>
                            {
                                open && (
                                <div className="flex flex-col shadow-md rounded-md top-2">
                                    <Button variant="text" onClick={()=>setOpen(!open)}>
                                        <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor rounded-md cursor-pointer">
                                            <Link to='/myprofile'>
                                                Profile <AccountCircle/>
                                            </Link>
                                        </h1>
                                    </Button>

                                    <Button variant="text" onClick={handleLogout}>
                                        <h1 className="bg-transparent px-4 py-2 text-gray-600 font-semibold hover:text-headingcolor rounded-md cursor-pointer">
                                            <Link>
                                                Logout <IconButton><LogoutIcon/></IconButton>
                                            </Link>
                                        </h1>
                                    </Button>
                                </div>
                                )
                            }
                        </div>
                    ):(
                        <StylingButton variant="contained"><Link to='/signup'>Login/Sign Up</Link></StylingButton>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;