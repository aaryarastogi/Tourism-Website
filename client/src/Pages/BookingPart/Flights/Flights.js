import { Box, Button, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import backend_url from "../../../config"
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
  departureDate1: "", returnDate1: ""
};

const Flights = () => {
  const { isDark } = useTheme();
  const { airports } = useAirports();
  const { email, logined } = useUser();
  const [form, setForm] = useState({ ...defaultForm });
  const [filteredFlights, setFilteredFlights] = useState([]);

  React.useEffect(() => {
    const fromAirport = airports.find(a => a.name === form.fromCity);
    const destAirport = airports.find(a => a.name === form.destination);
    if (fromAirport && destAirport) {
      const possible = fromAirport.flights.filter(f =>
        destAirport.flights.some(df => df.id === f.id));
      setFilteredFlights(possible);
    } else {
      setFilteredFlights([]);
    }
  }, [form.fromCity, form.destination, airports]);

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
      fromCity1, destination1, departureDate1, returnDate1 , flight1 
    } = form;
    if (
      (["Round Trip", "Multi City"].includes(category) &&
        (!fromCity || !destination || !departureDate || !returnDate || !flight)) ||
      (category === "One Way" &&
        (!fromCity || !destination || !departureDate || !flight))
    ) {
      alert("Kindly fill all required details!!!"); return false;
    }
    if (fromCity === destination) {
      alert("Current city and destination can never be same"); return false;
    }
    if (category !== "One Way") {
      const dep = new Date(departureDate);
      const ret = new Date(returnDate);
      if (ret < dep) { alert("Return date cannot be earlier than departure date."); return false; }
      const now = new Date();
      if (dep < now || ret < now) {
        alert("Departure/return dates cannot be in the past."); return false;
      }
    }
    return true;
  };

  const bookFlight = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = { email, ...form };
      const res = await axios.post(`${backend_url}/flightbooking`, payload);
      if (res.data === "fail") {
        alert("Flight booking failed. Please check the details.");
      } else {
        alert("Successfully, your flight is booked...");
        setTimeout(() => {
          window.location.reload();
        }, 500);
        setForm({ ...defaultForm });
      }
    } catch (e) {
      alert("An error occurred while booking the flight. Please try again.");
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
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

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {form.category === "Multi City" ? (
            <MultiCityForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
          ) : form.category === "Round Trip" ? (
            <RoundTripForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
          ) : (
            <OneWayForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
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