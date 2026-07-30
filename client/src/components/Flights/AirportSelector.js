import React from "react";
import { useTheme } from "../../context/ThemeContext";

const AirportSelector = ({ airports, value, onChange, label }) => {
  const { isDark } = useTheme();
  return (
    <div className="text-left md:ml-10">
      <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{label}</h3>
      <select value={value} onChange={onChange}
              className={`lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 rounded-lg px-3 transition-colors duration-200 focus:outline-none ${
                isDark 
                  ? 'bg-gray-800 text-white border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-500' 
                  : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-indigo-600'
              }`}>
        <option value="">choose</option>
        {airports.map(airport => (
          <option key={airport._id} value={airport.name} className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>{airport.name}</option>
        ))}
      </select>
    </div>
  );
};

export default AirportSelector;