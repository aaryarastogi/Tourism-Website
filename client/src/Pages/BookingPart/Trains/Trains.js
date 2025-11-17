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
import { useTheme } from "../../../context/ThemeContext";

const StylingRadio=styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`

const StylingButton=styled(Button)(({ theme }) => ({
    display: 'none'
  }))

const Trains=()=>{
    const { isDark } = useTheme();
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
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Train Booking 🚂</h1>
                    <StylingRadio
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        className="flex flex-wrap gap-4"
                    >
                        <FormControlLabel 
                            value="Book Train" 
                            control={<Radio checked={bookTrain === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Book Train Tickets</span>} 
                            onClick={handleBookTrain}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="Check PNR Status" 
                            control={<Radio checked={checkPNR === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Check PNR Status</span>} 
                            onClick={handleCheckPNR}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                        <FormControlLabel 
                            value="Live Train Status" 
                            control={<Radio checked={liveTrain === true} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />} 
                            label={<span className="text-white font-medium">Live Train Status</span>} 
                            onClick={handleTrain}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                        />
                    </StylingRadio>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
            {
                checkPNR ? (
                    <PNRChecker onPnrResult={handlePnrData} onPnrError={handlePnrError}/>
                ) : liveTrain ? (
                    <LiveTrainChecker onLiveResult={handleLiveData} onLiveError={handleLiveError}/>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                            <select value={fromCity} onChange={(e)=>setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                    <option value="">Choose Station</option>
                                    {
                                    stations.map((station) =>(
                                        <option key={station._id} value={station.name}>{station.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Destination</h3>
                            <select value={destination} onChange={(e)=>setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                    <option value="">Choose Station</option>
                                    {
                                    stations.map((station) =>(
                                        <option key={station._id} value={station.name}>{station.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Travel Date</h3>
                            <input type="date" onChange={handleTravelDate} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Class</h3>
                            <select value={seatingClass} onChange={(e)=>setSeatingClass(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                    <option value="">Choose Class</option>
                                    {
                                    classs.map((item,index) =>(
                                        <option key={index} value={item.value}>{item.value}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Train Number / Name</h3>
                            <select value={trainNumber} placeholder="Select Train No." onChange={handleTrainNumber} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                                    <option value="">Choose Train</option>
                                    {
                                    trains.map((item,index) =>(
                                        <option key={index} value={item.name}>{item.number} , {item.name}</option>
                                    ))}
                            </select>
                        </div>
                </div>
            )}
            
            {
                bookTrain && (
                    <div className="flex justify-end mt-8">
                        <button 
                            onClick={(e)=>logined ? handlingTrainBooking(e) : alert("You need to login/SignUp first")}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                        >
                            Book Train
                        </button>
                    </div>
                )
            }
                </div>
            </div>
            <ShowPNRResult pnrResult = {pnrResult} pnrError={pnrError}/>
            <ShowLiveTrainStatus liveResult = {liveResult} liveError={liveError}/>
        </div>
    )
}
        
export default Trains;