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

const StylingRadio = styled(RadioGroup)`display:flex; flex-direction:row;`;
const StylingButton = styled(Button)(({ theme }) => ({
  marginLeft: '85%', background: '#374151',
  [theme.breakpoints.down('md')]: { marginLeft: '65%' },
  ":hover": { background: '#52525b' }
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
        setForm({ ...defaultForm });
        window.location.reload();
      }
    } catch (e) {
      alert("An error occurred while booking the flight. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="w-auto bg-white md:mx-8 rounded-md py-10">
        <div className="flex flex-row space-x-2 ml-12 justify-between">
          <StylingRadio name="trip-type">
            {categoryOptions.map(opt => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio checked={form.category === opt.value} />}
                label={opt.label}
                onClick={() => handleCategory(opt.value)}
              />
            ))}
          </StylingRadio>
          <h1 className="pr-10 text-medium font-semibold text-gray-600 mt-2">
            Flight Booking 🤗
          </h1>
        </div>

        {/* Multi City */}
        {form.category === "Multi City" ? (
          <MultiCityForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
        ) : form.category === "Round Trip" ? (
          <RoundTripForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
        ) : (
          <OneWayForm airports={airports} handleField={handleField} form={form} filteredFlights = {filteredFlights}/>
        )}
        <StylingButton variant="contained" onClick={bookFlight}>Book Flight</StylingButton>
      </div>
    </div>
  );
};

export default Flights;