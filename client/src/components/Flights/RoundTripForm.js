import React from 'react'
import AirportSelector from './AirportSelector'
import DatePicker from './DatePicker'

const RoundTripForm = ({airports, form, handleField, filteredFlights, allFlights}) => {
  // Get the selected flight's price
  const selectedFlight = filteredFlights.find(f => {
    const flight = typeof f === 'object' ? f : null;
    return flight && flight.airline === form.flight;
  }) || allFlights.find(f => f.airline === form.flight);
  const flightPrice = selectedFlight?.price || 0;

  return (
    <div className="my-10 md:border-2 md:border-gray-300 mx-10 rounded-md">
    <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
        <AirportSelector airports={airports} value={form.fromCity} onChange={e => handleField("fromCity", e.target.value)} label="From" />
        <AirportSelector airports={airports} value={form.destination} onChange={e => handleField("destination", e.target.value)} label="Destination" />
        <DatePicker label="Departure" value={form.departureDate} onChange={e => handleField("departureDate", e.target.value)} />
        <DatePicker label="Return" value={form.returnDate} onChange={e => handleField("returnDate", e.target.value)} />
        <div className="text-left md:ml-10">
        <h3 className="font-semibold text-gray-800">Flights</h3>
        <select value={form.flight} onChange={e => handleField("flight", e.target.value)}
            className="lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 border-gray-50">
            <option>choose</option>
            {filteredFlights.map(fl => {
              const flight = typeof fl === 'object' ? fl : null;
              if (!flight || !flight.airline) return null;
              const price = flight.price || 5000;
              return (
                <option key={flight._id || flight.flightNumber || flight.airline} value={flight.airline}>
                  {flight.airline} - ₹{price.toLocaleString('en-IN')}
                </option>
              );
            }).filter(Boolean)}
        </select>
        </div>
        <div className="text-left md:ml-10">
          <h3 className="font-semibold text-gray-800">Number of Tickets</h3>
          <input 
            type="number" 
            min="1" 
            value={form.numberOfTickets || 1} 
            onChange={e => handleField("numberOfTickets", parseInt(e.target.value) || 1)}
            className="lg:w-44 w-56 h-12 text-md font-semibold border-2 border-gray-50 px-3 rounded"
          />
        </div>
        {flightPrice > 0 && form.numberOfTickets > 0 && (
          <div className="text-left md:ml-10 flex items-end">
            <div>
              <h3 className="font-semibold text-gray-800">Total Amount</h3>
              <p className="text-lg font-bold text-indigo-600">
                ₹{((flightPrice * 2) * (form.numberOfTickets || 1)).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (₹{flightPrice.toLocaleString('en-IN')} × 2 trips × {form.numberOfTickets || 1} tickets)
              </p>
            </div>
          </div>
        )}
    </div>
    </div>
  )
}

export default RoundTripForm
