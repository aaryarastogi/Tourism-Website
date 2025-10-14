import React from 'react'
import AirportSelector from './AirportSelector'
import DatePicker from './DatePicker'

const OneWayForm = ({airports, filteredFlights , form , handleField}) => {
  return (
    <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
    <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
        <AirportSelector airports={airports} value={form.fromCity} onChange={e => handleField("fromCity", e.target.value)} label="From" />
        <AirportSelector airports={airports} value={form.destination} onChange={e => handleField("destination", e.target.value)} label="Destination" />
        <DatePicker label="Departure" value={form.departureDate} onChange={e => handleField("departureDate", e.target.value)} />
        <div className="text-left md:ml-10">
        <h3 className="font-semibold text-gray-800">Flights</h3>
        <select value={form.flight} onChange={e => handleField("flight", e.target.value)}
            className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50">
            <option>choose</option>
            {filteredFlights.map(fl => (
            <option key={fl._id} value={fl.airline}>{fl.airline}</option>
            ))}
        </select>
        </div>
    </div>
    </div>
  )
}

export default OneWayForm
