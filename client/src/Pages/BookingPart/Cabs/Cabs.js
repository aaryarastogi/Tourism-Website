import React, { useEffect, useRef, useState } from "react";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import axios from "axios";
import {packages} from './data'
import { baseUrl } from "../../../HelperUrl/Helper";

const StylingRadio=styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`

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


const Cabs=()=>{
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


    //api to fetch all cities
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
    
    var [cities,setCities]=useState([]);
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
    var [airports,setAirports]=useState([]);
    axios(configAirports)
        .then(function (response) {
        const newData=(response.data.data);
        setAirports(newData);
    },[])
    .catch(function (error) {
        console.log(error);
    });

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');
        if(storedToken){
            setToken(storedToken);
            axios.get(`${baseUrl}/user`, {
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
            const response = await axios.post(`${baseUrl}/cabbooking`, {
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
            console.log(response.data);
            if (response.data === "fail") {
                alert("Cab booking failed. Please check the details.");
            } else {
                alert("Successfully, your cab is booked...");
                setData(response.data);
                // console.log("data", data);
                window.location.reload();
            }
        } catch (e) {
            alert("Cab booking failed. Please check the details.");
            console.log("Error:", e);
        }
    };
    
    return(
    <div className="w-full h-screen">
        <div className="w-auto bg-white md:mx-8 rounded-md py-10">
                <div className="flex flex-row space-x-2 ml-12 justify-between">
                    <StylingRadio
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="Outstation One Way" control={<Radio checked={OutStationOneway === true} />} label="Outstation One-Way" onClick={handleOutstationOneway} />
                        <FormControlLabel value="Outstation Round Trip" control={<Radio checked={OutstationRoundTrip === true} />} label="Outstation Round-Trip"  onClick={handleOutstationRoundTrip} />
                        <FormControlLabel value="Airport Transfers" control={<Radio checked={AirportTransfers === true} />} label="Airport Transfers" onClick={handleAirportTransfers} />
                        <FormControlLabel value="Hourly Rentals" control={<Radio checked={HourlyRentals === true} />} label="Hourly Rentals" onClick={handleHourlyRentals} />
                    </StylingRadio>
                    <h1 className="pr-10 text-medium font-semibold text-gray-600 mt-2">Online Cab Booking 🤗</h1>
                </div>

            {/* Outstation one way */}
            {
                OutStationOneway ? (
                    <div className="flex flex-col">
                        <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                            
                            {/* from component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">From</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        cities.map((city) =>(
                                            <option value={city}>{city}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            
                            {/* destination */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">To</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        cities.map((city) =>(
                                            <option value={city}>{city}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* departure-return */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Departure</h3>
                                <input type="date" onChange={(e)=> setDepartureDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"/>
                            </div>

                            </div>
                        </div>
                    </div>
                )
                : OutstationRoundTrip?(
                    <div className="flex flex-col">
                            <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                            <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                                
                                {/* from component */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">From</h3>
                                    <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                            <option>choose</option>
                                            {
                                            cities.map((city) =>(
                                                <option value={city}>{city}</option>
                                            ))
                                            }
                                    </select>
                                </div>
                                
                                {/* destination */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">To</h3>
                                    <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                            <option>choose</option>
                                            {
                                            cities.map((city) =>(
                                                <option value={city}>{city}</option>
                                            ))
                                            }
                                    </select>
                                </div>

                                {/* departure-return */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">Departure</h3>
                                    <input type="date" onChange={(e)=> setDepartureDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                                </div>

                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">Return</h3>
                                    <input type="date" onChange={(e)=> setReturnDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                                </div>

                                {/* Pickup time */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">PickUp Time</h3>
                                    <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"/>
                                </div>

                                {/* Drop time */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">Drop Time</h3>
                                    <input type="time" onChange={(e)=> setDropTime(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"/>
                                </div>

                            </div>
                        </div>
                    </div>
                )
                :AirportTransfers ?(
                    <div className="flex flex-col">
                        <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                            {/* from pickup location */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Airport</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>Pickup Airport Location</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* city to part */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">To</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>Destination Airport Location</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            {/* departure-return */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Departure</h3>
                                <input type="date" onChange={(e)=> setDepartureDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"/>
                            </div>

                            </div>
                        </div>
                    </div>
                )
                :(
                    <div className="flex flex-col">
                        <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                            
                            {/* PickUp location */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Pick Up Location</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>Select City</option>
                                        {
                                            cities.map((city) =>(
                                                <option value={city}>{city}</option>
                                            ))
                                        }
                                </select>
                            </div>

                            {/* pick up date */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Pick Up Date</h3>
                                <input type="date" onChange={(e)=> setPickupDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                            </div>

                            {/* Pickup time */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">PickUp Time</h3>
                                <input type="time" onChange={(e)=> setPickupTime(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"/>
                            </div>

                            {/* package */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Packages</h3>
                                <select value={packageValue} onChange={(e)=> setPackageValue(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>Select City</option>
                                        {
                                        packages.map((pack) =>(
                                            <option key={pack.id} value={pack.value}>{pack.value}</option>
                                        ))
                                        }
                                </select>
                            </div>

                            </div>
                        </div>
                    </div>
                )
            }
            <StylingButton variant="contained" onClick={(e)=> logined ? cabBooking(e) : alert("You need to login/signup...")} type="submit">Book cab</StylingButton>
            </div>
        </div>
    )
}

export default Cabs