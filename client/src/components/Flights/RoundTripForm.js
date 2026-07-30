import React from 'react'
import AirportSelector from './AirportSelector'
import DatePicker from './DatePicker'
import { useTheme } from '../../context/ThemeContext'

const RoundTripForm = ({airports, form, handleField, filteredFlights, allFlights}) => {
  const { isDark } = useTheme();
  // Get the selected flight's price
  const selectedFlight = filteredFlights.find(f => {
    const flight = typeof f === 'object' ? f : null;
    return flight && flight.airline === form.flight;
  }) || allFlights.find(f => f.airline === form.flight);
  const flightPrice = selectedFlight?.price || 0;

  return (
    <div className={`my-10 md:border-2 mx-10 rounded-md ${isDark ? 'border-gray-700 bg-gray-800/40' : 'border-gray-300 bg-white'}`}>
    <div className="flex md:flex-row flex-col flex-wrap justify-around my-4 md:space-y-0 space-y-4">
        <AirportSelector airports={airports} value={form.fromCity} onChange={e => handleField("fromCity", e.target.value)} label="From" />
        <AirportSelector airports={airports} value={form.destination} onChange={e => handleField("destination", e.target.value)} label="Destination" />
        <DatePicker label="Departure" value={form.departureDate} onChange={e => handleField("departureDate", e.target.value)} />
        <DatePicker label="Return" value={form.returnDate} onChange={e => handleField("returnDate", e.target.value)} min={form.departureDate} />
        <div className="text-left md:ml-10">
        <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Flights</h3>
        <select value={form.flight} onChange={e => handleField("flight", e.target.value)}
            className={`lg:w-44 w-56 h-12 text-md font-semibold capitalize cursor-pointer border-2 rounded-lg px-3 transition-colors duration-200 focus:outline-none ${
              isDark 
                ? 'bg-gray-800 text-white border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-500' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-indigo-600'
            }`}>
            <option value="">choose</option>
            {filteredFlights.map(fl => {
              const flight = typeof fl === 'object' ? fl : null;
              if (!flight || !flight.airline) return null;
              const price = flight.price || 5000;
              return (
                <option key={flight._id || flight.flightNumber || flight.airline} value={flight.airline} className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
                  {flight.airline} - ₹{price.toLocaleString('en-IN')}
                </option>
              );
            }).filter(Boolean)}
        </select>
        </div>
        <div className="text-left md:ml-10">
          <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Number of Tickets</h3>
          <input 
            type="number" 
            min="1" 
            value={form.numberOfTickets || 1} 
            onChange={e => handleField("numberOfTickets", parseInt(e.target.value) || 1)}
            className={`lg:w-44 w-56 h-12 text-md font-semibold border-2 rounded-lg px-3 transition-colors duration-200 focus:outline-none ${
              isDark 
                ? 'bg-gray-800 text-white border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-500' 
                : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 focus:border-indigo-600'
            }`}
          />
        </div>
        {flightPrice > 0 && form.numberOfTickets > 0 && (
          <div className="text-left md:ml-10 flex items-end">
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Total Amount</h3>
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
