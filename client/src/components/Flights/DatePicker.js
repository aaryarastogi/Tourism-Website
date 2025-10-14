import React from "react";

const DatePicker = ({ label, value, onChange }) => (
  <div className="text-left md:ml-10">
    <h3 className="font-semibold text-gray-800">{label}</h3>
    <input type="date" value={value} onChange={onChange}
           className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50" />
  </div>
);

export default DatePicker;