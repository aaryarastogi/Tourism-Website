import React from "react";

const AirportSelector = ({ airports, value, onChange, label }) => (
  <div className="text-left md:ml-10">
    <h3 className="font-semibold text-gray-800">{label}</h3>
    <select value={value} onChange={onChange}
            className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50">
      <option value="">choose</option>
      {airports.map(airport => (
        <option key={airport._id} value={airport.name}>{airport.name}</option>
      ))}
    </select>
  </div>
);

export default AirportSelector;