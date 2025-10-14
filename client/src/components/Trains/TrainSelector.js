import React from "react";

const TrainSelector = ({ trains, value, onChange }) => (
  <div className="text-left md:ml-10">
    <h3 className="font-semibold text-gray-800">Train Number / Name</h3>
    <select
      value={value}
      onChange={onChange}
      className="md:w-36 w-56 h-12 text-md font-semibold capitalize cursor-pointer"
    >
      <option value="">choose</option>
      {trains.map((train, index) => (
        <option key={index} value={train.name}>
          {train.number} , {train.name}
        </option>
      ))}
    </select>
  </div>
);

export default TrainSelector;