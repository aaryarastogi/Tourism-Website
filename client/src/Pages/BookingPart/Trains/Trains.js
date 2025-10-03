import { Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import axios from "axios";
import PNRChecker from "./pnrPart/PNRChecker"
import ShowPNRResult from "./pnrPart/ShowPNRResult";
import { classs , liveTrainStatus } from "./data";
import LiveTrainChecker from "./liveTrainPart/LiveTrainChecker";
import ShowLiveTrainStatus from "./liveTrainPart/ShowLiveTrainStatus";
import backend_url from "../../../config";

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

const Trains=()=>{
    const [category,setCategory]=useState('Book Train');
    const[bookTrain,setBookTrain]=useState(true);
    const [checkPNR , setCheckPNR]=useState(false);
    const [liveTrain,setLiveTrain]=useState(false);

    const handleBookTrain=(e)=>{
        setBookTrain(true);
        setCheckPNR(false);
        setLiveTrain(false);
        setCategory('Book Train')
        setPnrError(null)
        setPnrResult(null)
        setLiveError(null)
        setLiveResult(null)
    }

    const handleCheckPNR=()=>{
        setBookTrain(false);
        setCheckPNR(true);
        setLiveTrain(false);
        setCategory('Check PNR')
        setPnrError(null)
        setPnrResult(null)
        setLiveError(null)
        setLiveResult(null)
    }

    const handleTrain=()=>{
        setBookTrain(false);
        setCheckPNR(false);
        setLiveTrain(true);
        setCategory('Live Train Status')
        setPnrError(null)
        setPnrResult(null)
        setLiveError(null)
        setLiveResult(null)
    }
    
    const[fromCity,setFromCity]=useState('');
    const[destination,setDestination]=useState('');

    const[trainNumber,setTrainNumber]=useState('');
    const handleTrainNumber=(e)=>{
    setTrainNumber(e.target.value)
    }

    const[seatingClass,setSeatingClass]=useState('');
    const handleSeatingClass=(e)=>{
    setSeatingClass(e.target.value)
    }

    const [travelDate,setTravelDate] = useState(new Date())
    const handleTravelDate = (e) => {
        setTravelDate(new Date(e.target.value));
    }

    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');
    const[data,setData]=useState([]);

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

    const handlingTrainBooking=async(e)=>{
        e.preventDefault();
        try{
            const currDateObj = new Date();
            if (travelDate.setHours(0, 0, 0, 0) < currDateObj.setHours(0, 0, 0, 0)) {
                alert("Travel date cannot be earlier than current date.");
                return;
            }
            if (fromCity === destination) {
                alert("Kindly fill correct details! Current city and destination can never be the same.");
                return;
            }

            const response = await axios.post(`${backend_url}/trainbooking`,{
                email,category,fromCity,destination,travelDate,trainNumber,seatingClass
            })
            console.log(response.data);
            if (response.data === "fail") {
                alert("Train ticket booking failed. Please check the details.");
                console.log("boooking failed...");
            } else {
                alert("Successfully, your train ticket is booked...");
                setData(response.data);
                window.location.reload();
            }
        }
        catch(e){
            alert("Train ticket booking failed. Please check the details.");
            console.log('book train failed',e);
        }
    }
    const[stations,setStations]=useState([]);
    const fetchAllStations = async () => {
    try {
        const res = await axios.get(`${backend_url}/api/stations`);
        setStations(res.data.data);
    } catch (e) {
        console.error("Error in fetching airports:", e.response ? e.response.data : e.message);
    }
    };
    useEffect(()=> fetchAllStations , [])
    const[trains,setTrains]=useState([]);
    useEffect(() => {
        const fromCityBasedStation = stations.find((station) => station.name === fromCity);
        const destinationBasedStation = stations.find((station) => station.name === destination);

        if (fromCityBasedStation && destinationBasedStation) {
            const commonTrains = fromCityBasedStation.trains.filter((train) =>
                destinationBasedStation.trains.some((destTrain) => destTrain.id === train.id)
            );
            console.log("fromCityBasedStation" , fromCityBasedStation);
            console.log("destinationBasedStation" , destinationBasedStation);
            setTrains(commonTrains); 
        } else {
            setTrains([]);
        }
    }, [fromCity, destination]);

    const [pnrResult, setPnrResult] = useState(null);
    const [pnrError, setPnrError] = useState("");
    const handlePnrData = (data) => {
        setPnrResult(data);
    };
    const handlePnrError=(data)=>{
        setPnrError(data);
    }

    const [liveResult, setLiveResult] = useState(null);
    const [liveError, setLiveError] = useState("");
    const handleLiveData = (data) => {
        setLiveResult(data);
    };
    const handleLiveError=(data)=>{
        setLiveError(data);
    }

    return(
        <div className="w-full min-h-screen">
            <div className="w-auto bg-white md:mx-32 rounded-md py-10">
            <div className="flex flex-row space-x-2 ml-12 justify-between">
                <StylingRadio
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="Book Train" control={<Radio checked={bookTrain === true} />} label="Book Train Tickets" onClick={handleBookTrain}/>
                    <FormControlLabel value="Check PNR Status" control={<Radio checked={checkPNR === true} />} label="Check PNR Status"  onClick={handleCheckPNR} />
                    <FormControlLabel value="Live Train Status" control={<Radio checked={liveTrain === true} />} label="Live Train Status" onClick={handleTrain} />
                </StylingRadio>
                <h1 className="pr-10 text-medium font-semibold text-gray-600 mt-2">Train Booking 🤗</h1>
                
            </div>
            {
                checkPNR ? (
                    <PNRChecker onPnrResult={handlePnrData} onPnrError={handlePnrError}/>
                ) : liveTrain ? (
                    <LiveTrainChecker onLiveResult={handleLiveData} onLiveError={handleLiveError}/>
                ) : (
                <div className="flex flex-col flex-wrap">
                    <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
                    <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
                        <div className="text-left md:ml-10">
                            <h3 className="font-semibold text-gray-800">From</h3>
                            <select value={fromCity} onChange={(e)=>setFromCity(e.target.value)} className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                    <option>choose</option>
                                    {
                                    stations.map((station) =>(
                                        <option key={station._id} value={station.name}>{station.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="text-left md:ml-10">
                            <h3 className="font-semibold text-gray-800">Destination</h3>
                            <select value={destination} onChange={(e)=>setDestination(e.target.value)} className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                    <option>choose</option>
                                    {
                                    stations.map((station) =>(
                                        <option key={station._id} value={station.name}>{station.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="text-left md:ml-10">
                            <h3 className="font-semibold text-gray-800">Travel Date</h3>
                            <input type="date" onChange={handleTravelDate}className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"></input>
                        </div>
                        <div className="text-left md:ml-10">
                            <h3 className="font-semibold text-gray-800">Class</h3>
                            <select value={seatingClass} onChange={(e)=>setSeatingClass(e.target.value)} className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"> 
                                    <option>choose</option>
                                    {
                                    classs.map((item,index) =>(
                                        <option key={index} value={item.value}>{item.value}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="text-left md:ml-10">
                            <h3 className="font-semibold text-gray-800">Train Number / Name</h3>
                            <select value={trainNumber} placeholder="Select Train No." onChange={handleTrainNumber} className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer"> 
                                    <option>choose</option>
                                    {
                                    trains.map((item,index) =>(
                                        <option key={index} value={item.name}>{item.number} , {item.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            )}
            {
                bookTrain && (
                    <StylingButton variant="contained" onClick={(e)=>logined ? handlingTrainBooking(e) : alert("You need to login/SignUp first")}>Book Train</StylingButton>
                )
            }
            </div>
            <ShowPNRResult pnrResult = {pnrResult} pnrError={pnrError}/>
            <ShowLiveTrainStatus liveResult = {liveResult} liveError={liveError}/>
        </div>
    )
}
        
export default Trains;