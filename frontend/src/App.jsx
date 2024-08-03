import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Register from './components/Register';
import SessionHistory from './components/SessionHistory';
import { FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRegister = () => {
    setIsRegistering(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    fetchEvents();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { sessionId });
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      setIsLoggedIn(false);
      setEvents([]);
      setShowSessionHistory(false);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(events.filter(event => event._id !== deletedEventId));
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event));
  };

  const toggleSessionHistory = () => {
    setShowSessionHistory(!showSessionHistory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl opacity-10"></div>
        <div className="relative bg-gray-800 shadow-lg sm:rounded-3xl sm:p-16">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {!isLoggedIn ? (
                isRegistering ? (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Create an Account</h2>
                    <Register onRegister={handleRegister} />
                    <p className="mt-8 text-center text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => setIsRegistering(false)}
                        className="text-purple-400 hover:text-purple-300 font-medium transition duration-300"
                      >
                        Log in
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Welcome Back</h2>
                    <Login onLogin={handleLogin} />
                    <p className="mt-8 text-center text-gray-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="text-purple-400 hover:text-purple-300 font-medium transition duration-300"
                      >
                        Register
                      </button>
                    </p>
                  </>
                )
              ) : (
                <div className="space-y-10">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 sm:mb-0">Event Manager</h2>
                    <div className="space-y-2 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={toggleSessionHistory} 
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                      >
                        {showSessionHistory ? 'Hide Sessions' : 'Show Sessions'}
                      </button>
                      <button 
                        onClick={handleLogout} 
                        disabled={isLoggingOut}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                        ) : (
                          <FaSignOutAlt className="mr-2" />
                        )}
                        Logout
                      </button>
                    </div>
                  </div>
                  {showSessionHistory ? (
                    <SessionHistory />
                  ) : (
                    <>
                      <EventForm onEventCreated={handleEventCreated} />
                      <EventList 
                        events={events} 
                        onEventDeleted={handleEventDeleted}
                        onEventUpdated={handleEventUpdated}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;