import React, { useEffect, useRef, useState } from "react";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import axios from "axios";
import {packages} from './data'
import backend_url from "../../../config";
import { useTheme } from "../../../context/ThemeContext";

const StylingRadio=styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`

const StylingButton=styled(Button)(({ theme }) => ({
    display: 'none'
  }))


const Cabs=()=>{
    const { isDark } = useTheme();
    const [category,setCategory]=useState('Out Station One Way');
    const[OutStationOneway,setOutstationOneway]=useState(true);
    const [OutstationRoundTrip,setOutstationRoundTrip]=useState(false);
    const [AirportTransfers,setAirportTransfers]=useState(false);
    const [HourlyRentals,setHourlyRentals]=useState(false);

    const handleOutstationOneway=(e)=>{
        setOutstationOneway(true);
        setOutstationRoundTrip(false);
        setAirportTransfers(false);
        setHourlyRentals(false);
        setCategory('Out Station One Way')
    }

    const handleOutstationRoundTrip=()=>{
        setOutstationOneway(false);
        setOutstationRoundTrip(true);
        setAirportTransfers(false);
        setHourlyRentals(false);
        setCategory('Out Station Round Trip')
    }

    const handleAirportTransfers=()=>{
        setOutstationOneway(false);
        setOutstationRoundTrip(false);
        setAirportTransfers(true);
        setHourlyRentals(false);
        setCategory('Airport Transfers')
    }

    const handleHourlyRentals=()=>{
        setOutstationOneway(false);
        setOutstationRoundTrip(false);
        setAirportTransfers(false);
        setHourlyRentals(true);
        setCategory('Hourly Rentals')
    }

    const[fromCity,setFromCity]=useState('');
    const[destination,setDestination]=useState('');
    const [departureDate,setDepartureDate] = useState('')
    const [returnDate,setReturnDate] = useState('')
    const [pickupTime,setPickupTime] = useState()
    const [dropTime,setDropTime] = useState()
    const[pickupDate,setPickupDate]=useState(new Date());
    const[packageValue,setPackageValue]=useState(new Date());
    const[data,setData]=useState([])
    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');

    const [cities,setCities]=useState([]);
    const [airports,setAirports]=useState([]);

    // var configAirports = {
    //     method: 'get',
    //     url: 'https://airportgap.com/api/airports',
    //     headers: {
    //       'X-CSCAPI-KEY': 'S3AwWUVncFhudTVDRnVrdUJmSVQ1WDR4MDZBN253TlZBU2VWdENBVg=='
    //     }
    // };
    // var [airports,setAirports]=useState([]);
    // axios(configAirports)
    //     .then(function (response) {
    //     const newData=(response.data.data);
    //     setAirports(newData);
    //     console.log(airports);
    // },[])
    // .catch(function (error) {
    //     // console.log(error);
    // });

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
        var config = {
            method: 'post',
            url: 'https://countriesnow.space/api/v0.1/countries/cities',
            headers: {
                'X-CSCAPI-KEY': 'S3AwWUVncFhudTVDRnVrdUJmSVQ1WDR4MDZBN253TlZBU2VWdENBVg==',
                'Content-Type': 'application/json' // Ensure JSON format
            },
            data: {
                country: 'India'
            }
        };
        axios(config)
        .then(function (response) {
            const newData=(response.data.data);
            setCities(newData);
        },[])
        .catch(function (error) {
            console.log(error);
        });

        var configAirports = {
            method: 'get',
            url: 'https://airportgap.com/api/airports',
            headers: {
            'X-CSCAPI-KEY': 'S3AwWUVncFhudTVDRnVrdUJmSVQ1WDR4MDZBN253TlZBU2VWdENBVg=='
            }
        };
        
        axios(configAirports)
            .then(function (response) {
            const newData=(response.data.data);
            setAirports(newData);
            console.log(airports);
        },[])
        .catch(function (error) {
            // console.log(error);
        });
      },[])

      const cabBooking = async (e) => {
        e.preventDefault();
        try {   
            const departureDateObj = new Date(departureDate);
            const returnDateObj = new Date(returnDate);
            const currDateObj = new Date();
            const pickupTimeObj = new Date(pickupTime);
            const dropTimeObj = new Date(dropTime);

            if (returnDateObj < departureDateObj) {
                alert("Return date cannot be earlier than departure date.");
                return;
            }
            if (fromCity === destination) {
                alert("Kindly fill correct details! Current city and destination can never be the same.");
                return;
            }
            if (departureDateObj < currDateObj || returnDateObj < currDateObj) {
                alert("Kindly fill correct details! Departure and return dates cannot be in the past.");
                return;
            }
            if (pickupTimeObj < currDateObj) {
                alert("Pickup time cannot be in the past.");
                return;
            }
            if (dropTimeObj < currDateObj) {
                alert("Drop time cannot be in the past.");
                return;
            }
            if (dropTimeObj < pickupTimeObj) {
                alert("Drop time must be after pickup time.");
                return;
            }
            const response = await axios.post(`${backend_url}/cabbooking`, {
                email,  
                category,
                fromCity,
                destination,
                departureDate,
                returnDate,
                pickupTime,
                dropTime,
                packageValue
            });
            console.log(response);
            if (response.data === "fail") {
                alert("Cab booking failed. Please check the details.");
            } else {
                alert("Successfully, your cab is booked...");
                setData(response.data);
                window.location.reload();
            }
        } catch (e) {
            alert("Cab booking failed. Please check the details.");
            console.log("Error:", e);
        }
    };
    
    return(
    <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
        <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 md:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Online Cab Booking 🚗</h1>
                    <StylingRadio
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        className="flex flex-wrap gap-4"
                    >
                        <FormControlLabel 
                            value="Outstation One Way" 
                            control={<Radio checked={OutStationOneway === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Outstation One-Way</span>} 
                            onClick={handleOutstationOneway}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="Outstation Round Trip" 
                            control={<Radio checked={OutstationRoundTrip === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Outstation Round-Trip</span>} 
                            onClick={handleOutstationRoundTrip}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="Airport Transfers" 
                            control={<Radio checked={AirportTransfers === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Airport Transfers</span>} 
                            onClick={handleAirportTransfers}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="Hourly Rentals" 
                            control={<Radio checked={HourlyRentals === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Hourly Rentals</span>} 
                            onClick={handleHourlyRentals}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                    </StylingRadio>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
            {
                OutStationOneway ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Choose City</option>
                                        {
                                        cities.map((city) =>(
                                            <option key={city} value={city}>{city}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            
                            {/* destination */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Choose City</option>
                                        {
                                        cities.map((city) =>(
                                            <option key={city} value={city}>{city}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* departure-return */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                <input type="date" onChange={(e)=> setDepartureDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"/>
                            </div>
                    </div>
                )
                : OutstationRoundTrip?(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* from component */}
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                                    <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                            <option value="">Choose City</option>
                                            {
                                            cities.map((city) =>(
                                                <option key={city} value={city}>{city}</option>
                                            ))
                                            }
                                    </select>
                                </div>
                                
                                {/* destination */}
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                    <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                            <option value="">Choose City</option>
                                            {
                                            cities.map((city) =>(
                                                <option key={city} value={city}>{city}</option>
                                            ))
                                            }
                                    </select>
                                </div>

                                {/* departure-return */}
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                    <input type="date" onChange={(e)=> setDepartureDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                </div>

                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Return</h3>
                                    <input type="date" onChange={(e)=> setReturnDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                </div>

                                {/* Pickup time */}
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                    <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"/>
                                </div>

                                {/* Drop time */}
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Drop Time</h3>
                                    <input type="time" onChange={(e)=> setDropTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"/>
                                </div>
                    </div>
                )
                :AirportTransfers ?(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* from pickup location */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Airport</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Pickup Airport Location</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* city to part */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Destination Airport Location</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* departure-return */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                <input type="date" onChange={(e)=> setDepartureDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"/>
                            </div>
                    </div>
                )
                :(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* PickUp location */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Pick Up Location</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Select City</option>
                                        {
                                            cities.map((city) =>(
                                                <option key={city} value={city}>{city}</option>
                                            ))
                                        }
                                </select>
                            </div>

                            {/* pick up date */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Pick Up Date</h3>
                                <input type="date" onChange={(e)=> setPickupDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"/>
                            </div>

                            {/* package */}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-800 mb-2">Packages</h3>
                                <select value={packageValue} onChange={(e)=> setPackageValue(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                        <option value="">Select Package</option>
                                        {
                                        packages.map((pack) =>(
                                            <option key={pack.id} value={pack.value}>{pack.value}</option>
                                        ))
                                        }
                                </select>
                            </div>
                    </div>
                )
            }
            
            <div className="flex justify-end mt-8">
                <button 
                    onClick={(e)=> logined ? cabBooking(e) : alert("You need to login/signup...")} 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                    Book Cab
                </button>
            </div>
                </div>
            </div>
        </div>
    )
}

export default Cabs