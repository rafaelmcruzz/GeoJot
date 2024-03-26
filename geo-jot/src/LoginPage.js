import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { Navigate } from "react-router-dom";// Import Axios for making HTTP requests

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login credentials to the backend for authentication
      const response = await axios.post('http://localhost:3000/api/login', {
        email: email,
        password: password
      });

      // Handle successful login
      console.log('User logged in successfully:', response.data);
      setIsLoggedIn(true);
      // You may want to do something with the response data here
    } catch (error) {
      // Handle login error - e.g., display error message to the user
      console.error('Error logging in:', error);
    }
  };

  if (isLoggedIn) {
    // Redirect to home page after successful login
    // Replace '/home' with the path where you want to redirect
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
