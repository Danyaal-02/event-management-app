import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaPencilAlt, FaTimes } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const UpdateEventModal = ({ event, onClose, onEventUpdated }) => {
    const [name, setName] = useState(event.name);
    const [date, setDate] = useState(new Date(event.date));
    const [location, setLocation] = useState(event.location);
    const [description, setDescription] = useState(event.description);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/events/${event._id}`, {
          name,
          date: date.toISOString(),
          location,
          description,
        });
        onEventUpdated(response.data);
        onClose();
      } catch (error) {
        console.error('Error updating event:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-200">Update Event</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <FaTimes size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                <FaMapMarkerAlt className="inline-block mr-2" />
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
              />
            </div>
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
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : (
                <FaPencilAlt className="mr-2" />
              )}
              Update Event
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default UpdateEventModal;