import { Button, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Radio, RadioGroup, styled } from "@mui/material";
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from 'axios'
import { prices , rooms } from "./data";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import backend_url, { razorkey_id } from "../../../config";
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
    const[numberOfRooms,setNumberOfRooms]=useState(1);

    var [cities,setCities]=useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [allHotels, setAllHotels] = useState([]);
    
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
                const checkin = new Date(checkinDate);
                const checkout = new Date(checkoutDate);
                if (!location || !checkinDate || !checkoutDate || !room || !hotel) {
                    alert("Kindly fill all details!!!");
                    return;
                }
                if (checkin > checkout) {
                    alert("Checkout date must be after checkin date!");
                    return;
                }
                if (checkin < currDate || checkout < currDate) {
                    alert("Dates cannot be in the past!");
                    return;
                }
                if (!logined) {
                    alert("Please login first.");
                    return;
                }
                if (!numberOfRooms || numberOfRooms < 1) {
                    alert("Please enter a valid number of rooms (at least 1)!");
                    return;
                }

                const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

                if (nights <= 0) {
                    alert("Invalid number of nights.");
                    return;
                }
                const selectedHotel = allHotels.find(h => h.name === hotel);
                if (!selectedHotel) {
                    alert("Selected hotel not found.");
                    return;
                }
                const roomPriceMap = {
                    "1 Room": selectedHotel.pricing?.singleRoom || 1500,
                    "2 Room": selectedHotel.pricing?.doubleRoom || 2000,
                    "3 Room": selectedHotel.pricing?.tripleRoom || 2500,
                    "4 Room": selectedHotel.pricing?.quadRoom || 3000,
                    "1 Room with hall": selectedHotel.pricing?.roomWithHall || 5000
                };

                const pricePerRoomPerNight = roomPriceMap[room] || 1500;
                const amount = pricePerRoomPerNight * numberOfRooms * nights;  
                console.log(amount)
                const orderRes = await axios.post(`${backend_url}/create-order`, {
                    amount,
                    bookingType: "hotel"
                });

                const order  = orderRes.data;
                const options = {
                    key: razorkey_id, 
                    amount: order.amount,
                    currency: order.currency,
                    name: "Tourism App",
                    description: `Hotel booking for ${nights} nights`,
                    order_id: order.id,

                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(`${backend_url}/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                            if (verifyRes.data.status === "success") {
                                await axios.post(`${backend_url}/hotelbooking`, {
                                    email,
                                    category,
                                    location,
                                    checkinDate,
                                    checkoutDate,
                                    numberOfNights: nights,
                                    numberOfRooms,
                                    price: amount,
                                    room,
                                    payment_id: response.razorpay_payment_id
                                });

                                alert("Hotel booked successfully!");
                                window.location.reload();

                            } else {
                                alert("Payment verification failed!");
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
                    color: "#8b5cf6",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();

            } catch (error) {
                console.log("Hotel booking failed", error);
                alert("Something went wrong. Please try again.");
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
        const fetchAllHotels = async () => {
          try {
            const res = await axios.get(`${backend_url}/api/cities`);
            const allHotelsData = [];
            res.data.data.forEach(city => {
              if (city.hotels && Array.isArray(city.hotels)) {
                city.hotels.forEach(hotel => {
                  if (typeof hotel === 'object' && hotel._id) {
                    allHotelsData.push(hotel);
                  }
                });
              }
            });
            setAllHotels(allHotelsData);
          } catch (e) {
            console.error("Error fetching hotels:", e);
          }
        };
        fetchAllHotels();
      }, []);

      useEffect(() => {
        const selectedCity = cities.find((city) => city.name === location);
        if (selectedCity && selectedCity.hotels) {
          const hotelsWithData = selectedCity.hotels.map(hotel => {
            const hotelId = typeof hotel === 'object' ? (hotel._id || hotel) : hotel;
            const fullHotel = allHotels.find(ah => 
              ah._id?.toString() === hotelId.toString() || 
              ah.name === (typeof hotel === 'object' ? hotel.name : null)
            );
            return fullHotel || (typeof hotel === 'object' ? hotel : null);
          }).filter(Boolean);
          setFilteredHotels(hotelsWithData);
        } else {
          setFilteredHotels([]);
        }
      }, [location, cities, allHotels]);

    return(
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
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

                <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                    <select
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        setHotel(""); 
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

                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Hotels</h3>
                    <select
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="bg-white w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!location} 
                    >
                    <option value="">Choose a Hotel</option>
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotelItem, index) => {
                            if (!hotelItem || !hotelItem.name) return null;
                            const roomPriceMap = {
                                "1 Room": hotelItem.pricing?.singleRoom || 1500,
                                "2 Room": hotelItem.pricing?.doubleRoom || 2000,
                                "3 Room": hotelItem.pricing?.tripleRoom || 2500,
                                "4 Room": hotelItem.pricing?.quadRoom || 3000,
                                "1 Room with hall": hotelItem.pricing?.roomWithHall || 5000
                            };
                            const price = room && room !== "" 
                                ? roomPriceMap[room] || 1500 
                                : null;
                            return (
                                <option key={index} value={hotelItem.name}>
                                    {hotelItem.name} {price ? `- ₹${price.toLocaleString('en-IN')}/night` : ''}
                                </option>
                            );
                        }).filter(Boolean)
                    ) : (
                        <option disabled>No hotels available</option>
                    )}
                    </select>
                </div>
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Check In</h3>
                    <input type="date" onChange={(e)=> setCheckinDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                </div>

                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Check Out</h3>
                    <input type="date" onChange={(e)=> setCheckoutDate(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"></input>
                </div>
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Room Type</h3>
                    <select value={room} onChange={(e)=> setRoom(e.target.value)} className="w-full h-12 text-md font-medium capitalize cursor-pointer border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"> 
                    <option value="">Choose</option>
                    {   
                        rooms.map((item,index) =>(
                            <option key={index} value={item.value}>{item.value}</option>
                    ))}
                    </select>
                </div>
                <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Number of Rooms</h3>
                    <input 
                        type="number" 
                        min="1" 
                        value={numberOfRooms} 
                        onChange={(e)=> setNumberOfRooms(parseInt(e.target.value) || 1)}
                        className="w-full h-12 text-md font-medium border-2 border-gray-200 rounded-lg px-4 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                </div>
            </div>
            {hotel && room && room !== "" && numberOfRooms > 0 && checkinDate && checkoutDate && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">Total Amount</h3>
                            {(() => {
                                const checkin = new Date(checkinDate);
                                const checkout = new Date(checkoutDate);
                                const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
                                
                                if (nights <= 0) return null;
                                
                                const selectedHotel = allHotels.find(h => h.name === hotel);
                                if (!selectedHotel) return null;
                                
                                const roomPriceMap = {
                                    "1 Room": selectedHotel.pricing?.singleRoom || 1500,
                                    "2 Room": selectedHotel.pricing?.doubleRoom || 2000,
                                    "3 Room": selectedHotel.pricing?.tripleRoom || 2500,
                                    "4 Room": selectedHotel.pricing?.quadRoom || 3000,
                                    "1 Room with hall": selectedHotel.pricing?.roomWithHall || 5000
                                };
                                const pricePerRoomPerNight = roomPriceMap[room] || 1500;
                                const total = pricePerRoomPerNight * numberOfRooms * nights;
                                return (
                                    <>
                                        <p className="text-2xl font-bold text-purple-600">₹{total.toLocaleString('en-IN')}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            ₹{pricePerRoomPerNight.toLocaleString('en-IN')}/night × {numberOfRooms} room{numberOfRooms > 1 ? 's' : ''} × {nights} night{nights > 1 ? 's' : ''}
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