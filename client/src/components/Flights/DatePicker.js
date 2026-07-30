import React from "react";
import { useTheme } from "../../context/ThemeContext";

const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DatePicker = ({ label, value, onChange, min }) => {
  const { isDark } = useTheme();
  const defaultMin = getTodayDateString();
  return (
    <div className="text-left md:ml-10">
      <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{label}</h3>
      <input 
        type="date" 
        value={value} 
        onChange={onChange}
        min={min || defaultMin}
        className={`lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 rounded-lg px-3 transition-colors duration-200 focus:outline-none ${
          isDark 
            ? 'bg-gray-800 text-white border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-500' 
            : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-indigo-600'
        }`}
      />
    </div>
  );
};

export default DatePicker;