import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSignInAlt, FaSignOutAlt, FaNetworkWired, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions`);
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch session history. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return (
    <div className="text-center text-gray-300 flex items-center justify-center space-x-2">
      <FaSpinner className="animate-spin" />
      <span>Loading session history...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-400 flex items-center justify-center space-x-2">
      <FaExclamationTriangle />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
        <MdAccessTime className="mr-2" />
        Session History
      </h2>
      {sessions.length === 0 ? (
        <p className="text-gray-400">No session history available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session._id} className="bg-gray-800 border border-purple-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300 flex items-center">
                    <FaSignInAlt className="mr-2 text-green-500" />
                    Login Time
                  </span>
                  <span className="text-sm text-gray-400">{formatDate(session.loginTime)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300 flex items-center">
                    <FaSignOutAlt className="mr-2 text-red-500" />
                    Logout Time
                  </span>
                  <span className="text-sm text-gray-400">
                    {session.logoutTime ? formatDate(session.logoutTime) : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300 flex items-center">
                    <FaNetworkWired className="mr-2 text-blue-500" />
                    IP Address
                  </span>
                  <span className="text-sm text-gray-400">{session.ipAddress}</span>
                </div>
              </div>
              <div className={`px-4 py-2 ${session.logoutTime ? 'bg-gray-750' : 'bg-green-900'}`}>
                <span className={`text-xs ${session.logoutTime ? 'text-gray-400' : 'text-green-300'} flex items-center`}>
                  {session.logoutTime ? (
                    <>
                      <FaSignOutAlt className="mr-1" />
                      Completed
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Active Session
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;