import { Box, Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import backend_url, { razorkey_id } from "../../../config"
import useUser from "../../../components/Flights/useUser"
import useAirports from "../../../components/Flights/useAirports"
import MultiCityForm from "../../../components/Flights/MultiCityForm";
import RoundTripForm from "../../../components/Flights/RoundTripForm";
import OneWayForm from "../../../components/Flights/OneWayForm";
import { useTheme } from "../../../context/ThemeContext";

const StylingRadio = styled(RadioGroup)`display:flex; flex-direction:row;`;
const StylingButton = styled(Button)(({ theme }) => ({
  display: 'none'
}));

const categoryOptions = [
  { value: "One Way", label: "One Way" },
  { value: "Round Trip", label: "Round Trip" },
  { value: "Multi City", label: "Multi City" }
];

const defaultForm = {
  category: "One Way",
  fromCity: "", fromCity1: "", destination: "", destination1: "",
  flight: "", flight1: "",
  departureDate: "", returnDate: "",
  departureDate1: "", returnDate1: "",
  numberOfTickets: 1,
  flightPrice: 0
};

const Flights = () => {
  const { isDark } = useTheme();
  const { airports } = useAirports();
  const { email, logined } = useUser();
  const [form, setForm] = useState({ ...defaultForm });
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);

  React.useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/flights`);
        setAllFlights(res.data.data || []);
      } catch (e) {
        console.error('Error fetching flights:', e);
      }
    };
    fetchFlights();
  }, []);

  React.useEffect(() => {
    const fromAirport = airports.find(a => a.name === form.fromCity);
    const destAirport = airports.find(a => a.name === form.destination);
    if (fromAirport && destAirport) {
      const possible = fromAirport.flights.filter(f => {
        const fId = f._id || f;
        return destAirport.flights.some(df => {
          const dfId = df._id || df;
          return fId.toString() === dfId.toString();
        });
      });
      const flightsWithData = possible.map(f => {
        if (typeof f === 'object' && f.price !== undefined) {
          return f;
        }
        const flightId = typeof f === 'object' ? (f._id || f) : f;
        const fullFlight = allFlights.find(af => 
          af._id?.toString() === flightId.toString() || 
          af.flightNumber === (typeof f === 'object' ? f.flightNumber : null)
        );
        return fullFlight || (typeof f === 'object' ? f : null);
      }).filter(Boolean);
      setFilteredFlights(flightsWithData);
    } else {
      setFilteredFlights([]);
    }
  }, [form.fromCity, form.destination, airports, allFlights]);

  const handleCategory = useCallback(
    (value) => {
      setForm((prev) => ({
        ...defaultForm,
        category: value
      }));
    }, []
  );

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const {
      category, fromCity, destination, departureDate, returnDate, flight,
      fromCity1, destination1, departureDate1, returnDate1 , flight1,
      numberOfTickets
    } = form;
    if (
      (["Round Trip", "Multi City"].includes(category) &&
        (!fromCity || !destination || !departureDate || !returnDate || !flight)) ||
      (category === "One Way" &&
        (!fromCity || !destination || !departureDate || !flight))
    ) {
      alert("Kindly fill all required details!!!"); return false;
    }
    if (!numberOfTickets || numberOfTickets < 1) {
      alert("Please enter a valid number of tickets (at least 1)!"); return false;
    }
    if (fromCity === destination) {
      alert("Current city and destination can never be same"); return false;
    }
    // Date validation
    const getMidnightDate = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dep = getMidnightDate(departureDate);
    if (dep && dep < today) {
      alert("Departure date cannot be in the past.");
      return false;
    }

    if (category === "Round Trip") {
      const ret = getMidnightDate(returnDate);
      if (ret) {
        if (ret < dep) { 
          alert("Return date cannot be earlier than departure date."); 
          return false; 
        }
        if (ret < today) {
          alert("Return date cannot be in the past.");
          return false;
        }
      }
    }

    if (category === "Multi City") {
      const ret = getMidnightDate(returnDate);
      if (ret) {
        if (ret < dep) {
          alert("First return date cannot be earlier than departure date.");
          return false;
        }
        if (ret < today) {
          alert("First return date cannot be in the past.");
          return false;
        }
      }

      const dep1 = getMidnightDate(departureDate1);
      if (dep1) {
        if (dep1 < today) {
          alert("Second departure date cannot be in the past.");
          return false;
        }
        if (ret && dep1 < ret) {
          alert("Second departure date cannot be earlier than first return date.");
          return false;
        }
      }

      const ret1 = getMidnightDate(returnDate1);
      if (ret1) {
        if (ret1 < today) {
          alert("Second return date cannot be in the past.");
          return false;
        }
        if (dep1 && ret1 < dep1) {
          alert("Second return date cannot be earlier than second departure date.");
          return false;
        }
      }
    }
    return true;
  };

  const bookFlight = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const selectedFlight = filteredFlights.find(f => {
        const flight = typeof f === 'object' ? f : null;
        return flight && flight.airline === form.flight;
      }) || allFlights.find(f => f.airline === form.flight);
      const pricePerTicket = selectedFlight?.price || 5000;
      let amount;
      if (form.category === "Round Trip") {
        amount = (pricePerTicket * 2) * (form.numberOfTickets || 1);
      } else if (form.category === "Multi City") {
        const selectedFlight1 = filteredFlights.find(f => {
          const flight = typeof f === 'object' ? f : null;
          return flight && flight.airline === form.flight;
        }) || allFlights.find(f => f.airline === form.flight);
        const selectedFlight2 = filteredFlights.find(f => {
          const flight = typeof f === 'object' ? f : null;
          return flight && flight.airline === form.flight1;
        }) || allFlights.find(f => f.airline === form.flight1);
        const price1 = selectedFlight1?.price || 5000;
        const price2 = selectedFlight2?.price || 5000;
        amount = (price1 + price2) * (form.numberOfTickets || 1);
      } else {
        amount = pricePerTicket * (form.numberOfTickets || 1);
      } 
      const order = await axios.post(`${backend_url}/create-order`, {
        amount,
        bookingType: "flight"
      });

      const options = {
        key: razorkey_id,
        amount: order.data.amount,
        currency: "INR",
        name: "Tourism Flight Booking",
        description: "Flight Ticket Payment",
        order_id: order.data.id,

        handler: async function (response) {
          const verify = await axios.post(`${backend_url}/verify-payment`, response);

          if (verify.data.success) {
            const payload = { 
              email, 
              ...form, 
              payment_id: response.razorpay_payment_id,
              price: amount,
              numberOfTickets: form.numberOfTickets || 1
            };
            const res = await axios.post(`${backend_url}/flightbooking`, payload);

            if (res.data === "fail") {
              alert("Flight booking failed. Please try again.");
            } else {
              alert("🎉 Payment successful & Flight booked!");
              window.location.reload();
            }
          } else {
            alert("❌ Payment verification failed");
          }
        },

        prefill: {
          name: "User",
          email: email,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("An error occurred while initiating the payment");
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      <div className={`max-w-7xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Flight Booking ✈️</h1>
          <StylingRadio name="trip-type" className="flex flex-wrap gap-4">
            {categoryOptions.map(opt => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio checked={form.category === opt.value} sx={{ color: 'white', '&.Mui-checked': { color: '#fbbf24' } }} />}
                label={<span className="text-white font-medium">{opt.label}</span>}
                onClick={() => handleCategory(opt.value)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
              />
            ))}
          </StylingRadio>
        </div>

        <div className="p-6 md:p-8">
          {form.category === "Multi City" ? (
            <MultiCityForm airports={airports} handleField={handleField} form={form} filteredFlights={filteredFlights} allFlights={allFlights}/>
          ) : form.category === "Round Trip" ? (
            <RoundTripForm airports={airports} handleField={handleField} form={form} filteredFlights={filteredFlights} allFlights={allFlights}/>
          ) : (
            <OneWayForm airports={airports} handleField={handleField} form={form} filteredFlights={filteredFlights} allFlights={allFlights}/>
          )}
          
          <div className="flex justify-end mt-8">
            <button 
              onClick={bookFlight}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
              Book Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;