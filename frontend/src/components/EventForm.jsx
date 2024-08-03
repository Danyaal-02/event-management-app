import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaCloudSun, FaPencilAlt } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';


const EventForm = ({ onEventCreated }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, {
        name,
        date: date.toISOString(),
        location,
        description,
      });
      onEventCreated(response.data);
      setName('');
      setDate(new Date());
      setLocation('');
      setDescription('');
      setWeather(null);
      setWeatherError(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const checkWeather = async () => {
    try {
      setWeatherError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/weather/${location}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      if (error.response && error.response.status === 404) {
        setWeatherError('City not found. Please check the location and try again.');
      } else {
        setWeatherError('An error occurred while fetching weather data. Please try again later.');
      }
      setWeather(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          <BsFillPersonFill className="inline-block mr-2" />
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
          <FaCalendarAlt className="inline-block mr-2" />
          Date
        </label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="MMMM d, yyyy"
          className="block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
          wrapperClassName="w-full"
          popperClassName="react-datepicker-popper"
          customInput={
            <input
              type="text"
              className="block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
            />
          }
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300">
          <FaMapMarkerAlt className="inline-block mr-2" />
          Location
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="flex-1 block w-full bg-gray-700 border border-purple-600 rounded-l-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
          />
          <button
            type="button"
            onClick={checkWeather}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
          >
            <FaCloudSun className="mr-2" />
            Check Weather
          </button>
        </div>
      </div>
      
      {weatherError && (
        <div className="mt-4 p-4 bg-red-900 text-red-300 rounded-md border border-red-700">
          {weatherError}
        </div>
      )}
      
      {weather && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-md border border-purple-500">
          <h4 className="text-lg font-semibold text-gray-200">Weather for {location}</h4>
          <div className="flex items-center mt-2">
            <img src={`http://openweathermap.org/img/w/${weather.icon}.png`} alt={weather.description} className="mr-2" />
            <p className="text-gray-300">{weather.condition} ({weather.description})</p>
          </div>
          <p className="text-gray-300 mt-1">Temperature: {weather.temperature}°C (Feels like: {weather.feels_like}°C)</p>
          <p className="text-gray-300">Humidity: {weather.humidity}%</p>
          <p className="text-gray-300">Wind Speed: {weather.wind_speed} m/s</p>
        </div>
      )}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          <FaPencilAlt className="inline-block mr-2" />
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 transform hover:scale-105"
      >
        <FaCalendarAlt className="mr-2" />
        Create Event
      </button>
    </form>
  );
};

export default EventForm;