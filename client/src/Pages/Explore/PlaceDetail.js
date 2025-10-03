import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backend_url from '../../config';

function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios.get(`${backend_url}/api/places/${id}`)
      .then(response => setPlace(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!place) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Place Name */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{place.name}</h1>

      {/* Place Image */}
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
      />

      {/* Place Description */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {place.description}
      </p>

      {/* Famous Places Section */}
      <div className="p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Famous Places in {place.city}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {place.famousPlaces.map((famousPlace, index) => (
            <li
              key={index}
              className="bg-transparent p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-gray-700">{famousPlace}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlaceDetail;