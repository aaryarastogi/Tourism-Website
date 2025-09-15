import { Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, TextField, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import axios from 'axios';

//data
import {flights} from './data'
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

const Flights=()=>{
    useEffect(() => {
        window.scrollTo(1,1);
      }, []);

    const[category,setCategory]=useState('One Way');

    const[oneWay,setOneWay]=useState(true);
    const [roundTrip , setRoundTrip]=useState(false);
    const [multiCity,setMultiCity]=useState(false);
    const[fromCityIATA,setFromCityIATA]=useState('');
    const[destinationIATA,setDestinationIATA]=useState('');

    const handleOneWay=(e)=>{
        setRoundTrip(false)
        setOneWay(true)
        setMultiCity(false)
        setCategory('One Way')
    }

    const handleRoundTrip=()=>{
        setRoundTrip(!roundTrip)
        setOneWay(false)
        setMultiCity(false)
        setCategory('Round Trip')
    }

    const handleMultiCity=()=>{
        setRoundTrip(false)
        setOneWay(false)
        setMultiCity(true)
        setCategory('Multi City')
    }

    const[fromCity,setFromCity]=useState('');
    const[fromCity1,setFromCity1]=useState('');
    const [destination , setDestination]=useState('')
    const [destination1 , setDestination1]=useState('')
    const [flight , setFlight]=useState('')
    const [flight1 , setFlight1]=useState('')
    const [departureDate,setDepartureDate] = useState(new Date())
    const [returnDate,setReturnDate] = useState()
    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');
    const[data,setData]=useState([]);

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
      console.log(email);
      const bookFlight = async (e) => {
        e.preventDefault();
        try {
            const departureDateObj = new Date(departureDate);
            const returnDateObj = new Date(returnDate);
            const currDateObj = new Date();

            if ((category === 'Round Trip' || category === 'Multi City') && (!fromCity || !destination || !departureDate || !returnDate || !flight)) {
                alert("Kindly fill all required details!!!");
            } else if ((category === 'One Way') && (!fromCity || !destination || !departureDate || !flight)) {
                alert("Kindly fill all required details!!!");
            } 
            else if(fromCity === destination){
                alert("Kindly fill correct details! Current city and destination can never be same")
            }
            else if (returnDateObj < departureDateObj) {
                alert("Return date cannot be earlier than departure date.");
            } 
            else if (departureDateObj < currDateObj || returnDateObj < currDateObj) {
                alert("Kindly fill correct details! Departure and return dates cannot be in the past.");
            } 
            else {
                const response = await axios.post(`${baseUrl}/flightbooking`, {
                    email, category, fromCity, fromCity1, destination, destination1, flight, departureDate, returnDate
                });
    
                if (response.data === "fail") {
                    alert("Flight booking failed. Please check the details.");
                } else {
                    alert("Successfully, your flight is booked...");
                    setData(response.data);
                    console.log("data", data);
    
                    window.location.reload();
                }
            }
        } catch (e) {
            console.log(e);
            alert("An error occurred while booking the flight. Please try again.");
        }
    };

    var [airports,setAirports]=useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const fetchAllAirports = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/airports`);
          console.log(res.data.data);
          setAirports(res.data.data);
        } catch (e) {
          console.error("Error in fetching airports:", e.response ? e.response.data : e.message);
        }
      };
      useEffect(()=> fetchAllAirports , [])

      useEffect(() => {
        const fromCityBasedAirport = airports.find((airport) => airport.name === fromCity);
        const destinationBasedAirport = airports.find((airport) => airport.name === destination);
    
        if (fromCityBasedAirport && destinationBasedAirport) {
            const commonFlights = fromCityBasedAirport.flights.filter((flight) =>
                destinationBasedAirport.flights.some((destFlight) => destFlight.id === flight.id)
            );
            setFilteredFlights(commonFlights); 
        } else {
            setFilteredFlights([]);
        }
    }, [fromCity, destination, airports , fromCity1 , destination1]);

    return(
        <div className="w-full h-screen">
        <div className="w-auto bg-white md:mx-8 rounded-md py-10">
                <div className="flex flex-row space-x-2 ml-12 justify-between">
                    <StylingRadio
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="One Way" control={<Radio checked={oneWay === true} />} label="One Way" onClick={handleOneWay}/>
                        <FormControlLabel value="Round Trip" control={<Radio checked={roundTrip === true} />} label="Round Trip"  onClick={handleRoundTrip} />
                        <FormControlLabel value="MultiCity" control={<Radio checked={multiCity === true} />} label="Multi City" onClick={handleMultiCity} />
                    </StylingRadio>
                    <h1 className="pr-10 text-medium font-semibold text-gray-600 mt-2">Flight Booking 🤗</h1>
                </div>

                {
                    multiCity ? (
                    <div className="flex flex-col">
                        <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                            {/* from component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">From</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            {/* to component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Destination</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
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

                            {/* travellers part */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Flights</h3>
                                <select value={flight} onChange={(e)=> setFlight(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                            filteredFlights.map((fl) =>(
                                                <option key={fl._id} value={fl.airline}>{fl.airline}</option>
                                            ))
                                        }
                                </select>
                            </div>
                        </div>
                        </div>
                    <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap  justify-around my-4 md:space-y-0 space-y-4">
                            {/* from component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">From</h3>
                                <select value={fromCity1} onChange={(e)=> setFromCity1(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                            // <option>country</option>
                                        ))
                                        }
                                </select>
                            </div>
                            {/* to component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Destination</h3>
                                <select value={destination1} onChange={(e)=> setDestination1(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                            // <option>country</option>
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

                                {/* travellers part */}
                                <div className="text-left md:ml-10">
                                    <h3 className="font-semibold text-gray-800">Flights</h3>
                                    <select value={flight1} onChange={(e)=> setFlight1(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                            <option>choose</option>
                                            {
                                                filteredFlights.map((fl) =>(
                                                    <option key={fl._id} value={fl.airline}>{fl.airline}</option>
                                                ))
                                            }
                                    </select>
                                </div>
                        </div>
                    </div>
                </div>
                    ) : roundTrip ? (
                        
                        <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap  justify-around my-4 md:space-y-0 space-y-4">
                            {/* from component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">From</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            {/* to component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Destination</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
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

                                {/* travellers part */}
                                <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Flights</h3>
                                <select value={flight} onChange={(e)=> setFlight(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                            filteredFlights.map((fl) =>(
                                                <option key={fl._id} value={fl.airline}>{fl.airline}</option>
                                            ))
                                        }
                                </select>
                            </div>
    
                        </div>
                    </div>


                    ) : (
                    <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                        <div className="flex md:flex-row flex-col flex-wrap  justify-around my-4 md:space-y-0 space-y-4">
                            {/* from component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">From</h3>
                                <select value={fromCity} onChange={(e)=> setFromCity(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            {/* to component */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Destination</h3>
                                <select value={destination} onChange={(e)=> setDestination(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                        airports.map((airport) =>(
                                            <option key={airport._id} value={airport.name}>{airport.name}</option>
                                        ))
                                        }
                                </select>
                            </div>
                            
                            {/* departure-return */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Departure</h3>
                                <input type="date" onChange={(e)=> setDepartureDate(e.target.value)}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                            </div>

                            {/* travellers part */}
                            <div className="text-left md:ml-10">
                                <h3 className="font-semibold text-gray-800">Flights</h3>
                                <select value={flight} onChange={(e)=> setFlight(e.target.value)} className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                        <option>choose</option>
                                        {
                                            filteredFlights.map((fl) =>(
                                                <option key={fl._id} value={fl.airline}>{fl.airline}</option>
                                            ))
                                        }
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            <StylingButton variant="contained" onClick={bookFlight}>Book Flight</StylingButton>
        </div>
    </div>
    )
}
        
export default Flights;