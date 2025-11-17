import { Button, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Radio, RadioGroup, styled } from "@mui/material";
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from 'axios'
import { prices , rooms } from "./data";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import backend_url from "../../../config";
import { useTheme } from "../../../context/ThemeContext";

const StylingRadio=styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`

const StylingButton=styled(Button)(({ theme }) => ({
    display: 'none'
  }))

const Hotels=()=>{
    const { isDark } = useTheme();
    const [checkinDate,setCheckinDate] = useState(new Date())
    const[category,setCategory]=useState('rooms')
    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');
    const [checkoutDate,setCheckoutDate] = useState(new Date())
    const [location,setLocation]=useState('From');
    const[hotel,setHotel]=useState('');
    const[price,setPrice]=useState('');
    const[room,setRoom]=useState('')

    var [cities,setCities]=useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    //getting user info
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
                    setEmail(response.data.user.email);
                    setLogined(true);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
        window.scrollTo(1,1);
      },[])
      const hotelBooking = async (e) => {
        e.preventDefault();
        try {
            const currDate = new Date(); 
            const checkinDateObj = new Date(checkinDate);
            const checkoutDateObj = new Date(checkoutDate);
    
            if (!location || !checkinDate || !checkoutDate || !room || !price) {
                alert("Kindly fill all details!!!");
            } else if (checkinDateObj > checkoutDateObj) {
                alert("Checkout date must be after checkin date!!!");
            } else if (checkinDateObj < currDate || checkoutDateObj < currDate) {
                alert("Checkin dates and Checkout date cannot be in the past...");
            } else {
                await axios.post(`${backend_url}/hotelbooking`, {
                    email, category, location, checkinDate, checkoutDate, room, price
                })
                .then(res => {
                    alert('Hotel Ticket Booked Successfully...');
                    window.location.reload();
                    console.log(res.data);
                })
                .catch((e) => {
                    console.log("Failed", e);
                });
            }
        } catch (e) {
            console.log('Book hotel failed', e);
        }
    };

      const fetchAllCities = async () => {
        try {
          const res = await axios.get(`${backend_url}/api/cities`);
          console.log(res.data.data);
          setCities(res.data.data);
        } catch (e) {
          console.error("Error in fetching cities:", e.response ? e.response.data : e.message);
        }
      };
      useEffect(()=> fetchAllCities , [])

      useEffect(() => {
        const selectedCity = cities.find((city) => city.name === location);
        setFilteredHotels(selectedCity ? selectedCity.hotels : []);
      }, [location, cities]);

    return(
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 md:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Hotel Booking 🏨</h1>
                    <p className="text-white/90 mb-4">Book Domestic and International Property Online</p>
                    <StylingRadio
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        className="flex flex-wrap gap-4"
                    >
                        <FormControlLabel 
                            value="rooms" 
                            control={<Radio checked={category === "rooms"} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Upto 4 Rooms</span>} 
                            onChange={(e)=>setCategory(e.target.value)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="group" 
                            control={<Radio checked={category === "group"} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Group Deals</span>} 
                            onChange={(e)=>setCategory(e.target.value)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                    </StylingRadio>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Location */}
                 <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                    <select
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        setHotel(""); // Reset hotel selection
                    }}
                    className="bg-white w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                    >
                    <option value="">Choose a City</option>
                    {cities.map((item, index) => (
                        <option key={index} value={item.name}>
                        {item.name}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Hotels Selection */}
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Hotels</h3>
                    <select
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="bg-white w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!location} // Disable if no city is selected
                    >
                    <option value="">Choose a Hotel</option>
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotelItem, index) => (
                        <option key={index} value={hotelItem.name}>
                            {hotelItem.name}
                        </option>
                        ))
                    ) : (
                        <option disabled>No hotels available</option>
                    )}
                    </select>
                </div>

                {/* check-in & check-out */}
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Check In</h3>
                    <input type="date" onChange={(e)=> setCheckinDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                </div>

                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Check Out</h3>
                    <input type="date" onChange={(e)=> setCheckoutDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                </div>

                {/* rooms & guests */}
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Rooms & Guests</h3>
                    <select value={room} onChange={(e)=> setRoom(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                    <option value="">Choose</option>
                    {   
                        rooms.map((item,index) =>(
                            <option key={index} value={item.value}>{item.value}</option>
                    ))}
                    </select>
                </div>

                {/* price per night */}
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Price Per Night</h3>
                    <select value={price} onChange={(e)=> setPrice(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                    <option value="">Choose</option>
                    {
                        prices.map((item,index) =>(
                            <option key={index} value={item.value}>{item.value}</option>
                    ))}
                    </select>
                </div>
            </div>
            
            <div className="flex justify-end mt-8">
                <button 
                    onClick={(e)=>logined ? hotelBooking(e) : alert("You need to login/SignUp first")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                    Book Hotel
                </button>
            </div>
                </div>
            </div>
        </div>
    )
}

export default Hotels;