import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUserPlus, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, onCloseAndNavigate, children, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        {children}
        <button
          onClick={isSuccess ? onCloseAndNavigate : onClose}
          className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Register = ({ onRegisterComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [serverResponse, setServerResponse] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password,
      });

      setServerResponse(response.data.message);
      setIsSuccess(true);
      setShowModal(true);
    } catch (error) {
      let errorMessage = 'An error occurred during registration. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many registration attempts. Please try again later.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      setServerResponse(errorMessage);
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onCloseAndNavigate={() => {
          setShowModal(false);
          onRegisterComplete();
        }}
        isSuccess={isSuccess}
      >
        <div className="text-center">
          {isSuccess ? (
            <>
              <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-gray-300">
                {serverResponse}
              </p>
              <p className="text-gray-300 mt-2">
                Please check your email to verify your account. A verification link has been sent to {email}.
              </p>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="mx-auto text-yellow-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Registration Failed</h2>
              <p className="text-gray-300">
                {serverResponse}
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Register;