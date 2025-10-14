import React from "react";

const StationSelector = ({ stations, value, onChange, label }) => (
  <div className="text-left md:ml-10">
    <h3 className="font-semibold text-gray-800">{label}</h3>
    <select
      value={value}
      onChange={onChange}
      className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50"
    >
      <option value="">choose</option>
      {stations.map((station) => (
        <option key={station._id} value={station.name}>
          {station.name}
        </option>
      ))}
    </select>
  </div>
);

export default StationSelector;