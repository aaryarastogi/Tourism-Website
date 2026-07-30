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
import backend_url, { razorkey_id } from "../../../config";
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
    const todayDateString = React.useMemo(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);
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

    const[numberOfTickets,setNumberOfTickets]=useState(1);
    const handleNumberOfTickets=(e)=>{
    setNumberOfTickets(parseInt(e.target.value) || 1)
    }

    const [travelDate,setTravelDate] = useState(todayDateString)
    const handleTravelDate = (e) => {
        setTravelDate(e.target.value);
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


const handlingTrainBooking = async (e) => {
    e.preventDefault();

    try {
        const getMidnightDate = (dateVal) => {
            if (!dateVal) return null;
            const d = new Date(dateVal);
            if (isNaN(d.getTime())) return null;
            d.setHours(0, 0, 0, 0);
            return d;
        };

        const travelDateObj = getMidnightDate(travelDate);
        const currDateObj = new Date();
        currDateObj.setHours(0, 0, 0, 0);

        if (travelDateObj && travelDateObj < currDateObj) {
            alert("Travel date cannot be earlier than today.");
            return;
        }
        if (fromCity === destination) {
            alert("Source and destination cannot be the same.");
            return;
        }

        if (!logined) {
            alert("Please login first to book train tickets.");
            return;
        }

        if (!seatingClass || seatingClass === "All Class" || !trainNumber) {
            alert("Please select train and seating class.");
            return;
        }

        if (!numberOfTickets || numberOfTickets < 1) {
            alert("Please enter a valid number of tickets (at least 1)!");
            return;
        }
        const selectedTrain = allTrains.find(t => t.name === trainNumber || t.number === trainNumber);
        if (!selectedTrain) {
            alert("Selected train not found.");
            return;
        }
        const classPriceMap = {
            "Sleeper Class": selectedTrain.pricing?.sleeperClass || 500,
            "Third AC": selectedTrain.pricing?.thirdAC || 1200,
            "Second AC": selectedTrain.pricing?.secondAC || 2000,
            "First AC": selectedTrain.pricing?.firstAC || 3500,
            "Second Seating": selectedTrain.pricing?.secondSeating || 400,
            "Vistadome AC": selectedTrain.pricing?.vistadomeAC || 2500,
            "AC Chair Car": selectedTrain.pricing?.acChairCar || 1500
        };

        const pricePerTicket = classPriceMap[seatingClass] || 1500;
        const amount = pricePerTicket * numberOfTickets;
        const orderRes = await axios.post(`${backend_url}/create-order`, {
            amount,
            bookingType: "train",
        });

        const order  = orderRes.data;
        const options = {
            key: razorkey_id, 
            amount: order.amount,
            currency: order.currency,
            name: "Tourism App",
            description: "Train Ticket Booking Payment",
            order_id: order.id,

            handler: async function (response) {
                try {
                    const verifyRes = await axios.post(`${backend_url}/verify-payment`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyRes.data.status === "success") {
                        const bookingRes = await axios.post(`${backend_url}/trainbooking`, {
                            email,
                            category,
                            fromCity,
                            destination,
                            travelDate,
                            trainNumber,
                            seatingClass,
                            numberOfTickets,
                            price: amount,
                            payment_id: response.razorpay_payment_id,
                        });

                        if (bookingRes.data === "fail") {
                            alert("Train booking failed after payment.");
                        } else {
                            alert("Your train booking is confirmed!");
                            window.location.reload();
                        }
                    } else {
                        alert("Payment verification failed.");
                    }
                } catch (err) {
                    console.log(err);
                    alert("Something went wrong after payment.");
                }
            },
            prefill: {
                name: email,
                email: email,
            },
            theme: {
                color: "#3399cc",
            },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (err) {
        console.log(err);
        alert("Payment or booking failed.");
    }
};

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
    const[allTrains,setAllTrains]=useState([]);
    useEffect(() => {
        const fetchAllTrains = async () => {
            try {
                const res = await axios.get(`${backend_url}/api/trains`);
                setAllTrains(res.data.data || []);
            } catch (e) {
                console.error("Error fetching trains:", e);
            }
        };
        fetchAllTrains();
    }, []);

    useEffect(() => {
        const fromCityBasedStation = stations.find((station) => station.name === fromCity);
        const destinationBasedStation = stations.find((station) => station.name === destination);

        if (fromCityBasedStation && destinationBasedStation) {
            const commonTrains = fromCityBasedStation.trains.filter((train) =>
                destinationBasedStation.trains.some((destTrain) => destTrain.id === train.id)
            );
            const trainsWithData = commonTrains.map(train => {
                const trainId = typeof train === 'object' ? (train._id || train) : train;
                const fullTrain = allTrains.find(at => 
                    at._id?.toString() === trainId.toString() || 
                    at.number === (typeof train === 'object' ? train.number : null)
                );
                return fullTrain || (typeof train === 'object' ? train : null);
            }).filter(Boolean);
            setTrains(trainsWithData); 
        } else {
            setTrains([]);
        }
    }, [fromCity, destination, stations, allTrains]);

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
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
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

                <div className="p-6 md:p-8">
            {
                checkPNR ? (
                    <PNRChecker onPnrResult={handlePnrData} onPnrError={handlePnrError}/>
                ) : liveTrain ? (
                    <LiveTrainChecker onLiveResult={handleLiveData} onLiveError={handleLiveError}/>
                ) : (
                <>
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
                            <input type="date" value={travelDate} onChange={handleTravelDate} min={todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
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
                                    trains.map((item,index) => {
                                        if (!item || !item.name) return null;
                                        const classPriceMap = {
                                            "Sleeper Class": item.pricing?.sleeperClass || 500,
                                            "Third AC": item.pricing?.thirdAC || 1200,
                                            "Second AC": item.pricing?.secondAC || 2000,
                                            "First AC": item.pricing?.firstAC || 3500,
                                            "Second Seating": item.pricing?.secondSeating || 400,
                                            "Vistadome AC": item.pricing?.vistadomeAC || 2500,
                                            "AC Chair Car": item.pricing?.acChairCar || 1500
                                        };
                                        const price = seatingClass && seatingClass !== "All Class" && seatingClass !== "" 
                                            ? classPriceMap[seatingClass] || 1500 
                                            : null;
                                        return (
                                            <option key={index} value={item.name}>
                                                {item.number} , {item.name} {price ? `- ₹${price.toLocaleString('en-IN')}` : ''}
                                            </option>
                                        );
                                    }).filter(Boolean)}
                            </select>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-800 mb-2">Number of Tickets</h3>
                            <input 
                                type="number" 
                                min="1" 
                                value={numberOfTickets} 
                                onChange={handleNumberOfTickets}
                                className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                            />
                        </div>
                </div>
                {trainNumber && seatingClass && seatingClass !== "All Class" && seatingClass !== "" && numberOfTickets > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">Total Amount</h3>
                                {(() => {
                                    const selectedTrain = allTrains.find(t => t.name === trainNumber || t.number === trainNumber);
                                    if (!selectedTrain) return null;
                                    const classPriceMap = {
                                        "Sleeper Class": selectedTrain.pricing?.sleeperClass || 500,
                                        "Third AC": selectedTrain.pricing?.thirdAC || 1200,
                                        "Second AC": selectedTrain.pricing?.secondAC || 2000,
                                        "First AC": selectedTrain.pricing?.firstAC || 3500,
                                        "Second Seating": selectedTrain.pricing?.secondSeating || 400,
                                        "Vistadome AC": selectedTrain.pricing?.vistadomeAC || 2500,
                                        "AC Chair Car": selectedTrain.pricing?.acChairCar || 1500
                                    };
                                    const pricePerTicket = classPriceMap[seatingClass] || 1500;
                                    const total = pricePerTicket * numberOfTickets;
                                    return (
                                        <>
                                            <p className="text-2xl font-bold text-green-600">₹{total.toLocaleString('en-IN')}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                ₹{pricePerTicket.toLocaleString('en-IN')} × {numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
                </>
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