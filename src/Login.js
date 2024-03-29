import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import Register from './Register';
import { Navigate } from "react-router-dom";
import { useUser } from './UserContext';
import frombg from './frombg.jpeg';
import logo from './logo.jpg';

function Login({ }) {
  const [showRegister, setShowRegister] = useState(false); // State to track whether to show the register form
  const [usernameInput, setUsernameInput] = useState(''); // State to store username input
  const [password, setPassword] = useState(''); // State to store password input
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const { setUsername } = useUser();

  const toggleRegisterForm = () => {
    setShowRegister(prevState => !prevState);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send login credentials to the backend for authentication
      const response = await axios.post('http://localhost:3000/api/login', {
        username: usernameInput,
        password
      });

      // Handle successful login
      console.log('User logged in successfully:', response.data);
      setIsLoggedIn(true);
      setUsername(response.data.user.username); // Adjusted access path
      // After successful login
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', response.data.user.username);
      console.log('Current user:', response.data.user.username);

 
    } catch (error) {
      // Handle login error - e.g., display error message to the user
      console.error('Error logging in:', error);
    }
  };

  if (isLoggedIn) {
    // Redirect to home page after successful login
    return <Navigate to="/home" />;
  }

  return (
    <div className="background-image">
    <div className="login-page">
      <div className='form'>
        <img src={frombg} />
      </div>
      <div className="form">
        {!showRegister ? (
          <div>
            <img src={logo} class="logo" />
            <h2 type="title">Welcome to GeoJot</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input type="text" id="username" name="username" placeholder="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} required />
              </div>
              <div className="form-group">
                <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        ) : (
          <Register />
        )}
        <form className="login-form">
          {/* Button to toggle between login and register forms */}
          <button type="button" onClick={toggleRegisterForm}>
            {showRegister ? 'Already have an account? Login' : 'Don\'t have an account? Sign up'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
