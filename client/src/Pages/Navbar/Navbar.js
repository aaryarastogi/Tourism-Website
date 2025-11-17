import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Box, Drawer, Icon, IconButton, Typography, styled } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {motion} from 'framer-motion'
import backend_url from "../../config";
import { useTheme } from "../../context/ThemeContext";

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
    const { isDark, toggleTheme } = useTheme();
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
        axios.get(`${backend_url}/user`, {
            headers: {
                'Authorization': `Bearer ${storedToken}`, 
            },
            })
            .then(response => {
                if (response.data.success) {
                    setUsername(response.data.user.username);
                    setLogined(true);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownVisible && !event.target.closest('.dropdown-container')) {
                setDropdownVisible(false);
            }
            if (open && !event.target.closest('.user-dropdown-container')) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownVisible, open]);

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
    const items = [
    { text: 'Book Flights', link: '/flights' },
    { text: 'Book Hotels', link: '/hotels' },
    { text: 'Book Cabs', link: '/cabs' }
    ];

    return(
        <div className={`flex flex-row p-2 sm:p-3 md:p-4 justify-between items-center backdrop-blur-lg ${isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'} shadow-lg mx-2 sm:mx-3 md:mx-6 lg:mx-12 xl:mx-24 rounded-lg sm:rounded-xl border overflow-visible sticky top-2 sm:top-3 md:top-4 z-[100] transition-colors duration-300`}>
            <div className="flex flex-row items-center gap-2 sm:gap-3">
                <IconButton 
                    className="md:hidden" 
                    onClick={()=>setIsDrawerOpen(true)}
                    sx={{ color: isDark ? '#e5e7eb' : '#404575', padding: '8px' }}
                    size="small"
                >
                    <MenuIcon className="text-xl sm:text-2xl" />
                </IconButton>
                <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl cursor-pointer">
                    <span className="text-headingcolor bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold"><Link to='/'>myjourney.com</Link></span>
                </h1>
            </div>
            <Drawer anchor="left" open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)} className="">
                <Box p={2} width='250px' textAlign='left' role='presentation' sx={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
                <motion.h1
                className={`text-center font-semibold text-xl sm:text-2xl ${isDark ? 'text-gray-200' : 'text-headingcolor'}`}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                    >Our Facilities</motion.h1>
                    <div className="mt-4 space-y-1">
                        {
                            logined && (
                                <h1 className={`font-medium text-sm sm:text-md text-left p-2.5 sm:p-3 ${isDark ? 'hover:bg-gray-700 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600'} rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent ${isDark ? 'hover:border-indigo-500' : 'hover:border-indigo-600'}`}><Link to='/mytrips' onClick={()=>setIsDrawerOpen(false)}>My Bookings</Link></h1>
                            )
                        }
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
                                className={`font-medium text-sm sm:text-md text-left p-2.5 sm:p-3 ${isDark ? 'hover:bg-gray-700 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600'} rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent ${isDark ? 'hover:border-indigo-500' : 'hover:border-indigo-600'}`}
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
                                }}  className={`font-medium text-sm sm:text-md text-left p-2.5 sm:p-3 ${isDark ? 'hover:bg-gray-700 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600'} rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent ${isDark ? 'hover:border-indigo-500' : 'hover:border-indigo-600'}`}><Link to='/myprofile' onClick={()=>setIsDrawerOpen(false)}>My Account</Link></motion.h1>
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
                        }}  className={`font-medium text-sm sm:text-md text-left p-2.5 sm:p-3 ${isDark ? 'hover:bg-gray-700 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600'} rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent ${isDark ? 'hover:border-indigo-500' : 'hover:border-indigo-600'}`}>Settings</motion.h1>
                    </div>
                </Box>
            </Drawer>
            <div className="space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 flex flex-row items-center relative">
                <div className="flex flex-col relative dropdown-container">
                    <h1 className={`md:block hidden ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} font-semibold transition-colors duration-200 text-sm sm:text-md cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'}`} onClick={()=>setDropdownVisible(!dropdownVisible)}>Booking Form</h1>
                    {
                        dropdownVisible && 
                        <div className={`absolute top-full left-0 mt-2 flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl rounded-lg border overflow-hidden min-w-[160px] sm:min-w-[180px] z-[100]`}>
                            <Link to='/flights' onClick={()=>setDropdownVisible(false)}>
                                <h1 className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'} font-medium transition-all duration-200 cursor-pointer border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>Flights</h1>
                            </Link>
                            <Link to='/trains' onClick={()=>setDropdownVisible(false)}>
                                <h1 className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'} font-medium transition-all duration-200 cursor-pointer border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>Trains</h1>
                            </Link>
                            <Link to='/hotels' onClick={()=>setDropdownVisible(false)}>
                                <h1 className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'} font-medium transition-all duration-200 cursor-pointer border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>Hotels</h1>
                            </Link>
                            <Link to='/cabs' onClick={()=>setDropdownVisible(false)}>
                                <h1 className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'} font-medium transition-all duration-200 cursor-pointer`}>Cabs</h1>
                            </Link>
                        </div>
                    }
                </div>
                <h1 className={`md:block hidden ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} font-semibold transition-colors duration-200 text-sm sm:text-md cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'}`} onClick={handleDiscover}>Discover</h1>
                <h1 className={`md:block hidden ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} font-semibold transition-colors duration-200 text-sm sm:text-md cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'}`} onClick={()=>setIsDrawerOpen(true)}>Services</h1>
                
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-all duration-300 shadow-md hover:shadow-lg`}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <LightModeIcon className="text-lg sm:text-xl"/> : <DarkModeIcon className="text-lg sm:text-xl"/>}
                </button>
                {
                    logined ? (
                        <div className="relative user-dropdown-container">
                            <h1 className="cursor-pointer font-semibold text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg truncate max-w-[80px] sm:max-w-[120px] md:max-w-none" onClick={()=>setOpen(!open)} title={username}>{username}</h1>
                            {
                                open && (
                                <div className={`absolute right-0 top-full mt-2 flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl rounded-lg border overflow-hidden min-w-[160px] sm:min-w-[180px] z-[100]`}>
                                    <Button variant="text" onClick={()=>setOpen(!open)} className="w-full">
                                        <h1 className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'} font-medium transition-all duration-200 cursor-pointer flex items-center gap-2`}>
                                            <Link to='/myprofile' className="flex items-center gap-2 w-full">
                                                <AccountCircle className="text-base sm:text-lg"/> Profile
                                            </Link>
                                        </h1>
                                    </Button>

                                    <Button variant="text" onClick={handleLogout} className="w-full">
                                        <div className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-md ${isDark ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'} font-medium transition-all duration-200 cursor-pointer flex items-center gap-2`}>
                                            <LogoutIcon className="text-base sm:text-lg"/> Logout
                                        </div>
                                    </Button>
                                </div>
                                )
                            }
                        </div>
                    ):(
                        <Link to='/signup'><button className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs sm:text-sm md:text-base rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Login/Sign Up</button></Link>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;