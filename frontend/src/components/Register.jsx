import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password,
      });
      onRegister();
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === "Email already exists.") {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else {
          setError(error.response.data.message);
        }
      } else if (error.message.includes('rate limit')) {
        setError('Too many registration attempts. Please try again later.');
      } else if (error.message.includes('Network Error')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          <FaEnvelope className="inline-block mr-2" />
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          <FaLock className="inline-block mr-2" />
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-purple-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-300"
        />
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded relative flex items-center" role="alert">
          <FaExclamationTriangle className="mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
          ) : (
            <FaUserPlus className="mr-2" />
          )}
          Register
        </button>
      </div>
    </form>
  );
};

export default Register;