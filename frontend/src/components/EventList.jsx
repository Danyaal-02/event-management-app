import React, { useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaCloudSun, FaTrashAlt, FaInfoCircle, FaEdit } from 'react-icons/fa';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { TiThermometer } from 'react-icons/ti';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import UpdateEventModal from './UpdateEventModal';

const EventList = ({ events, onEventDeleted, onEventUpdated }) => {
  const [weatherData, setWeatherData] = useState({});
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState({});
  const [deletingEvent, setDeletingEvent] = useState({});

  const handleDelete = async (id) => {
    setDeletingEvent(prev => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
      onEventDeleted(id);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeletingEvent(prev => ({ ...prev, [id]: false }));
    }
  };

  const checkWeather = async (id, location) => {
    setLoadingWeather(prev => ({ ...prev, [id]: true }));
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/weather/${location}`);
      setWeatherData(prevState => ({
        ...prevState,
        [id]: response.data
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoadingWeather(prev => ({ ...prev, [id]: false }));
    }
  };

  const openUpdateModal = (event) => {
    setSelectedEvent(event);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedEvent(null);
    setUpdateModalOpen(false);
  };

  return (
    <div className="mt-8 px-4 sm:px-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-400">No events found.</p>
      ) : (
        <ul className="space-y-6">
          {events.map((event) => (
            <li key={event._id} className="bg-gray-800 shadow-md overflow-hidden rounded-lg border border-purple-700">
              <div className="px-4 py-5 bg-gradient-to-r from-purple-900 to-pink-900">
                <h3 className="text-lg leading-6 font-medium text-gray-200">{event.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  <FaCalendarAlt className="inline-block mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-purple-700">
                <dl>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-400 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">{event.location}</dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-400 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">{event.description}</dd>
                  </div>
                  {weatherData[event._id] && (
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-900 to-pink-900">
                      <dt className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <FaCloudSun className="mr-2" />
                        Weather
                      </dt>
                      <dd className="text-sm text-gray-200">
                        <div className="flex items-center mb-2">
                          <img src={`http://openweathermap.org/img/w/${weatherData[event._id].icon}.png`} alt={weatherData[event._id].description} className="mr-2" />
                          <span>{weatherData[event._id].condition} ({weatherData[event._id].description})</span>
                        </div>
                        <p className="flex items-center mb-1">
                          <TiThermometer className="mr-2" />
                          Temperature: {weatherData[event._id].temperature}°C (Feels like: {weatherData[event._id].feels_like}°C)
                        </p>
                        <p className="flex items-center mb-1">
                          <WiHumidity className="mr-2" />
                          Humidity: {weatherData[event._id].humidity}%
                        </p>
                        <p className="flex items-center">
                          <WiStrongWind className="mr-2" />
                          Wind Speed: {weatherData[event._id].wind_speed} m/s
                        </p>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="px-4 py-3 bg-gray-900 sm:px-6">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => checkWeather(event._id, event.location)}
                    disabled={loadingWeather[event._id]}
                    className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingWeather[event._id] ? (
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    ) : (
                      <FaCloudSun className="mr-2" />
                    )}
                    Check Weather
                  </button>
                  <button
                    onClick={() => openUpdateModal(event)}
                    className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                  >
                    <FaEdit className="mr-2" />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    disabled={deletingEvent[event._id]}
                    className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingEvent[event._id] ? (
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    ) : (
                      <FaTrashAlt className="mr-2" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {updateModalOpen && selectedEvent && (
        <UpdateEventModal
          event={selectedEvent}
          onClose={closeUpdateModal}
          onEventUpdated={onEventUpdated}
        />
      )}
    </div>
  );
};

export default EventList;