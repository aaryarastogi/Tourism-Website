import { Button, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Radio, RadioGroup, styled } from "@mui/material";
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from 'axios'
import { prices , rooms } from "./data";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import backend_url from "../../../config";

const StylingRadio=styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`

const StylingButton=styled(Button)(({ theme }) => ({
    marginLeft:'85%',
    marginBottom:'15px',
    background: '#374151',
    [theme.breakpoints.down('md')]: {
      marginLeft:'65%'
  },
  ":hover":{
    background:'#52525b'
  }
  }))

const Hotels=()=>{
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
        <div className="w-full h-screen overflow-hidden">
            <div className="w-auto bg-white md:mx-32 rounded-md">
            <div className="flex flex-row space-x-2 ml-12">
                <StylingRadio
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="rooms" control={<Radio checked={category === "rooms"}/>} label="Upto 4 Rooms" onChange={(e)=>setCategory(e.target.value)}/>
                    <FormControlLabel value="group" control={<Radio checked={category === "group"} />} label="Group Deals" onChange={(e)=>setCategory(e.target.value)}/>
                </StylingRadio>
                <h1 className="text-gray-500 mt-12 font-semibold text-md">Book Domestic and International Property Online. To list your property.</h1>  
            </div>

            <div className="flex md:flex-row flex-col flex-wrap pt-4 justify-around md:ml-0 ml-10">
                 {/* Location */}
                 <div className="text-left md:ml-10 py-8">
                    <h3 className="font-semibold text-gray-800">Location</h3>
                    <select
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        setHotel(""); // Reset hotel selection
                    }}
                    className="bg-white w-56 md:w-36 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"
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
                <div className="text-left md:ml-10 py-8">
                    <h3 className="font-semibold text-gray-800">Hotels</h3>
                    <select
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="bg-white w-56 md:w-36 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"
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
                <div className="text-left md:ml-10 py-8">
                    <h3 className="font-semibold text-gray-800">Check In</h3>
                    <input type="date" onChange={(e)=> setCheckinDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                </div>

                <div className="text-left md:ml-10 py-8">
                    <h3 className="font-semibold text-gray-800">Check Out</h3>
                    <input type="date" onChange={(e)=> setCheckoutDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                </div>

                {/* rooms & guests */}
                <div className="text-left md:ml-10 py-4 space-y-4">
                    <h3 className="font-semibold text-gray-800">Rooms & Guests</h3>
                    <select value={room} onChange={(e)=> setRoom(e.target.value)} className="md:w-auto w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                    <option className=" bg-blue-400">choose</option>
                    <h1>Adults</h1>
                    {   
                        rooms.map((item,index) =>(
                            <option key={index} value={item.value}>{item.value}</option>
                    ))}
                    </select>
                </div>

                {/* price per night */}
                <div className="text-left md:ml-10 py-4 space-y-4">
                    <h3 className="font-semibold text-gray-800">Price Per Night</h3>
                    <select value={price} onChange={(e)=> setPrice(e.target.value)} className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                    <option className=" bg-blue-400">choose</option>
                    {
                        prices.map((item,index) =>(
                            <option key={index} value={item.value}>{item.value}</option>
                    ))}
                    </select>
                </div>
            </div>
            <StylingButton variant="contained" onClick={(e)=>logined ? hotelBooking(e) : alert("You need to login/SignUp first")}>Book Hotel</StylingButton>
            </div>
        </div>
    )
}

export default Hotels;