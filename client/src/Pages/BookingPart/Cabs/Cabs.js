import React, { useEffect, useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import axios from "axios";
import { packages } from './data';
import backend_url, { razorkey_id } from "../../../config";
import { useTheme } from "../../../context/ThemeContext";

const StylingRadio = styled(RadioGroup)`
    display:flex;
    flex-direction:row;
`;

const StylingButton = styled(Button)(({ theme }) => ({
    display: 'none'
}));

const BASE_PRICE_PER_KM = 10; 
const getTimeMultiplier = (time) => {
    if (!time) return 1.0;
    const [hours] = time.split(':').map(Number);
    if (hours >= 5 && hours < 9) return 0.8;
    if (hours >= 9 && hours < 12) return 1.0;
    if (hours >= 12 && hours < 17) return 1.1;
    if (hours >= 17 && hours < 21) return 1.3;
    return 1.5;
};

const calculateDistance = (fromCity, toCity) => {
    if (!fromCity || !toCity || fromCity === toCity) return 0;
    const cityDistances = {
        'Delhi-Mumbai': 1400,
        'Mumbai-Delhi': 1400,
        'Delhi-Bangalore': 2100,
        'Bangalore-Delhi': 2100,
        'Mumbai-Bangalore': 850,
        'Bangalore-Mumbai': 850,
        'Delhi-Kolkata': 1500,
        'Kolkata-Delhi': 1500,
        'Mumbai-Kolkata': 2000,
        'Kolkata-Mumbai': 2000,
        'Delhi-Chennai': 2200,
        'Chennai-Delhi': 2200,
        'Mumbai-Chennai': 1300,
        'Chennai-Mumbai': 1300,
        'Delhi-Hyderabad': 1600,
        'Hyderabad-Delhi': 1600,
        'Mumbai-Hyderabad': 700,
        'Hyderabad-Mumbai': 700,
        'Delhi-Pune': 1500,
        'Pune-Delhi': 1500,
        'Mumbai-Pune': 150,
        'Pune-Mumbai': 150,
    };
    
    const key = `${fromCity}-${toCity}`;
    if (cityDistances[key]) {
        return cityDistances[key];
    }
    if (fromCity.includes('Airport') || toCity.includes('Airport')) {
        return 30; 
    }
    return 50;
};

const Cabs = () => {
    const { isDark } = useTheme();
    const todayDateString = React.useMemo(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);
    const [category, setCategory] = useState('Out Station One Way');
    const [OutStationOneway, setOutstationOneway] = useState(true);
    const [OutstationRoundTrip, setOutstationRoundTrip] = useState(false);
    const [AirportTransfers, setAirportTransfers] = useState(false);
    const [HourlyRentals, setHourlyRentals] = useState(false);

    const handleOutstationOneway = () => {
        setOutstationOneway(true);
        setOutstationRoundTrip(false);
        setAirportTransfers(false);
        setHourlyRentals(false);
        setCategory('Out Station One Way');
    };

    const handleOutstationRoundTrip = () => {
        setOutstationOneway(false);
        setOutstationRoundTrip(true);
        setAirportTransfers(false);
        setHourlyRentals(false);
        setCategory('Out Station Round Trip');
    };

    const handleAirportTransfers = () => {
        setOutstationOneway(false);
        setOutstationRoundTrip(false);
        setAirportTransfers(true);
        setHourlyRentals(false);
        setCategory('Airport Transfers');
    };

    const handleHourlyRentals = () => {
        setOutstationOneway(false);
        setOutstationRoundTrip(false);
        setAirportTransfers(false);
        setHourlyRentals(true);
        setCategory('Hourly Rentals');
    };

    const [fromCity, setFromCity] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [dropTime, setDropTime] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date());
    const [packageValue, setPackageValue] = useState('');
    const [numberOfBookings, setNumberOfBookings] = useState(1);
    const [data, setData] = useState([]);
    const [email, setEmail] = useState('');
    const [logined, setLogined] = useState(false);
    const [token, setToken] = useState('');

    const [cities, setCities] = useState([]);
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.get(`${backend_url}/user`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
                .then(response => {
                    if (response.data.success) {
                        setEmail(response.data.user.email);
                        setLogined(true);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error.message);
                });
        }

        // fetch Indian cities
        var config = {
            method: 'post',
            url: 'https://countriesnow.space/api/v0.1/countries/cities',
            headers: {
                'X-CSCAPI-KEY': 'S3AwWUVncFhudTVDRnVrdUJmSVQ1WDR4MDZBN253TlZBU2VWdENBVg==',
                'Content-Type': 'application/json'
            },
            data: { country: 'India' }
        };
        axios(config)
            .then(function (response) {
                const newData = (response.data.data);
                setCities(newData);
            })
            .catch(function (error) {
                console.log(error);
            });

        // fetch airports
        var configAirports = {
            method: 'get',
            url: 'https://airportgap.com/api/airports',
            headers: {
                'X-CSCAPI-KEY': 'S3AwWUVncFhudTVDRnVrdUJmSVQ1WDR4MDZBN253TlZBU2VWdENBVg=='
            }
        };

        axios(configAirports)
            .then(function (response) {
                const newData = (response.data.data);
                setAirports(newData);
            })
            .catch(function (error) {

            });
    }, []);

    const validate = () => {
        try {
            const parseLocalDateTimeField = (dateVal, timeStr) => {
                let year, month, day;
                if (!dateVal) {
                    const today = new Date();
                    year = today.getFullYear();
                    month = today.getMonth();
                    day = today.getDate();
                } else if (dateVal instanceof Date) {
                    year = dateVal.getFullYear();
                    month = dateVal.getMonth();
                    day = dateVal.getDate();
                } else {
                    const parts = dateVal.split("-");
                    year = parseInt(parts[0], 10);
                    month = parseInt(parts[1], 10) - 1;
                    day = parseInt(parts[2], 10);
                }

                let hours = 0;
                let minutes = 0;
                if (timeStr) {
                    const parts = timeStr.split(":");
                    hours = parseInt(parts[0], 10);
                    minutes = parseInt(parts[1], 10);
                }

                return new Date(year, month, day, hours, minutes, 0, 0);
            };

            const departureDateObj = departureDate ? parseLocalDateTimeField(departureDate) : null;
            const returnDateObj = returnDate ? parseLocalDateTimeField(returnDate) : null;

            const currDateObj = parseLocalDateTimeField(null);
            const currDateTimeObj = new Date();

            const basePickupDate = HourlyRentals ? pickupDate : departureDate;
            const baseDropDate = HourlyRentals ? pickupDate : returnDate;

            const pickupDateTime = pickupTime ? parseLocalDateTimeField(basePickupDate, pickupTime) : null;
            const dropDateTime = dropTime ? parseLocalDateTimeField(baseDropDate, dropTime) : null;

            if (returnDateObj && departureDateObj && returnDateObj < departureDateObj) {
                alert("Return date cannot be earlier than departure date.");
                return false;
            }
            if (fromCity === destination) {
                alert("Kindly fill correct details! Current city and destination can never be the same.");
                return false;
            }
            if (departureDateObj && departureDateObj < currDateObj) {
                alert("Kindly fill correct details! Departure date cannot be in the past.");
                return false;
            }
            if (returnDateObj && returnDateObj < currDateObj) {
                alert("Kindly fill correct details! Return date cannot be in the past.");
                return false;
            }
            if (pickupDateTime && pickupDateTime < currDateTimeObj) {
                alert("Pickup time cannot be in the past.");
                return false;
            }
            if (dropDateTime && dropDateTime < currDateTimeObj) {
                alert("Drop time cannot be in the past.");
                return false;
            }
            if (pickupDateTime && dropDateTime && dropDateTime < pickupDateTime) {
                alert("Drop time must be after pickup time.");
                return false;
            }
        } catch (err) {
            console.error("Validation error", err);
            alert("Kindly fill correct details!");
            return false;
        }
        return true;
    };
    const cabBooking = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (!numberOfBookings || numberOfBookings < 1) {
                alert("Please enter a valid number of bookings (at least 1)!");
                return;
            }
            let distance = 0;
            if (HourlyRentals && packageValue) {
                const kmMatch = packageValue.match(/(\d+)\s*kms?/i);
                distance = kmMatch ? parseInt(kmMatch[1]) : 50;
            } else {
                distance = calculateDistance(fromCity, destination);
            }
            const timeMultiplier = getTimeMultiplier(pickupTime);
            let basePrice = BASE_PRICE_PER_KM * distance * timeMultiplier;
            if (OutstationRoundTrip) {
                basePrice = basePrice * 2;
            }
            
            const amount = Math.round(basePrice * numberOfBookings);
            const orderResp = await axios.post(`${backend_url}/create-order`, {
                amount,
                bookingType: "cab"
            });
            const order = orderResp.data;

            const options = {
                key: razorkey_id, 
                amount: order.amount, 
                currency: "INR",
                name: "Tourism Cab Booking",
                description: `${category} - Cab Booking`,
                order_id: order.id,
                prefill: {
                    name: "Customer",
                    email: email || "",
                },
                handler: async function (response) {
                    try {
                        // 2) Verify payment on backend
                        const verifyResp = await axios.post(`${backend_url}/verify-payment`, response);

                        if (verifyResp.data.success) {
                            // 3) Save the booking only after successful verification
                            let distance = 0;
                            if (HourlyRentals && packageValue) {
                                const kmMatch = packageValue.match(/(\d+)\s*kms?/i);
                                distance = kmMatch ? parseInt(kmMatch[1]) : 50;
                            } else {
                                distance = calculateDistance(fromCity, destination);
                            }
                            
                            const payload = {
                                email,
                                category,
                                fromCity,
                                destination,
                                departureDate,
                                returnDate,
                                pickupTime,
                                dropTime,
                                packageValue,
                                numberOfBookings,
                                distance,
                                price: amount,
                                payment_id: response.razorpay_payment_id
                            };

                            const saveResp = await axios.post(`${backend_url}/cabbooking`, payload);

                            if (saveResp.data === "fail") {
                                alert("Cab booking failed while saving booking. Please contact support.");
                            } else {
                                alert("🎉 Payment successful & Cab booked!");
                                setData(saveResp.data);
                                setFromCity("");
                                setDestination("");
                                setDepartureDate("");
                                setReturnDate("");
                                setPickupTime("");
                                setDropTime("");
                                setPackageValue("");
                                window.location.reload();
                            }
                        } else {
                            alert("❌ Payment verification failed. Booking not saved.");
                        }
                    } catch (err) {
                        console.error("Error during verification/saving:", err);
                        alert("An error occurred while verifying payment or saving booking.");
                    }
                },
                theme: { color: "#ff6b00" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Error initiating payment:", err);
            alert("Cab booking failed. Please try again.");
        }
    };

    return (
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                                    <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                        <option value="">Choose City</option>
                                        {
                                            cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                    <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                        <option value="">Choose City</option>
                                        {
                                            cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} min={todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                </div>

                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                </div>

                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 mb-2">Number of Bookings</h3>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={numberOfBookings} 
                                        onChange={(e) => setNumberOfBookings(parseInt(e.target.value) || 1)}
                                        className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )
                            : OutstationRoundTrip ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">From</h3>
                                        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Choose City</option>
                                            {
                                                cities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                        <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Choose City</option>
                                            {
                                                cities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} min={todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Return</h3>
                                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={departureDate || todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                        <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Drop Time</h3>
                                        <input type="time" value={dropTime} onChange={(e) => setDropTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Number of Bookings</h3>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={numberOfBookings} 
                                            onChange={(e) => setNumberOfBookings(parseInt(e.target.value) || 1)}
                                            className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            )
                            : AirportTransfers ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Airport</h3>
                                        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Pickup Airport Location</option>
                                            {
                                                airports.map((airport) => (
                                                    <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">To</h3>
                                        <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Destination Airport Location</option>
                                            {
                                                airports.map((airport) => (
                                                    <option key={airport.id} value={airport.attributes.name}>{airport.attributes.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Departure</h3>
                                        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} min={todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                        <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Number of Bookings</h3>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={numberOfBookings} 
                                            onChange={(e) => setNumberOfBookings(parseInt(e.target.value) || 1)}
                                            className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            )
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Pick Up Location</h3>
                                        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Select City</option>
                                            {
                                                cities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Pick Up Date</h3>
                                        <input type="date" value={pickupDate instanceof Date ? pickupDate.toISOString().slice(0, 10) : pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={todayDateString} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">PickUp Time</h3>
                                        <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors" />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Packages</h3>
                                        <select value={packageValue} onChange={(e) => setPackageValue(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors">
                                            <option value="">Select Package</option>
                                            {
                                                packages.map((pack) => (
                                                    <option key={pack.id} value={pack.value}>{pack.value}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800 mb-2">Number of Bookings</h3>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={numberOfBookings} 
                                            onChange={(e) => setNumberOfBookings(parseInt(e.target.value) || 1)}
                                            className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            )
                    }

                    {/* Total Amount Display */}
                    {((fromCity && destination && pickupTime) || (HourlyRentals && packageValue && pickupTime)) && numberOfBookings > 0 && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Total Amount</h3>
                                    {(() => {
                                        let distance = 0;
                                        if (HourlyRentals && packageValue) {
                                            const kmMatch = packageValue.match(/(\d+)\s*kms?/i);
                                            distance = kmMatch ? parseInt(kmMatch[1]) : 50;
                                        } else {
                                            distance = calculateDistance(fromCity, destination);
                                        }
                                        
                                        const timeMultiplier = getTimeMultiplier(pickupTime);
                                        let basePrice = BASE_PRICE_PER_KM * distance * timeMultiplier;
                                        
                                        if (OutstationRoundTrip) {
                                            basePrice = basePrice * 2;
                                        }
                                        
                                        const total = Math.round(basePrice * numberOfBookings);
                                        const timeLabel = timeMultiplier === 0.8 ? 'Early Morning (20% off)' :
                                                         timeMultiplier === 1.0 ? 'Morning (Normal)' :
                                                         timeMultiplier === 1.1 ? 'Afternoon (+10%)' :
                                                         timeMultiplier === 1.3 ? 'Evening (+30%)' :
                                                         'Night (+50%)';
                                        
                                        return (
                                            <>
                                                <p className="text-2xl font-bold text-orange-600">₹{total.toLocaleString('en-IN')}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    ₹{BASE_PRICE_PER_KM}/km × {distance} km × {timeMultiplier.toFixed(1)}x ({timeLabel})
                                                    {OutstationRoundTrip ? ' × 2 (Round Trip)' : ''} × {numberOfBookings} booking{numberOfBookings > 1 ? 's' : ''}
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={(e) => logined ? cabBooking(e) : alert("You need to login/signup...")}
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                        >
                            {(() => {
                                let distance = 0;
                                if (HourlyRentals && packageValue) {
                                    const kmMatch = packageValue.match(/(\d+)\s*kms?/i);
                                    distance = kmMatch ? parseInt(kmMatch[1]) : 50;
                                } else {
                                    distance = calculateDistance(fromCity, destination);
                                }
                                const timeMultiplier = getTimeMultiplier(pickupTime);
                                let basePrice = BASE_PRICE_PER_KM * distance * timeMultiplier;
                                if (OutstationRoundTrip) {
                                    basePrice = basePrice * 2;
                                }
                                const amount = Math.round(basePrice * numberOfBookings);
                                return amount > 0 ? `Pay ₹${amount.toLocaleString('en-IN')} & Book Cab` : 'Book Cab';
                            })()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cabs;