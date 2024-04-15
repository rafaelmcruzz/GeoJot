import React, { useState } from 'react';
import axios from 'axios';
import Register from './Register';
import { Navigate } from "react-router-dom";
import { useUser } from './UserContext';
import frombg from './frombg.jpeg';
import logo from './logo.jpg';
import './Home.css';

function Login({ }) {
  const [showRegister, setShowRegister] = useState(false);
  const [usernameInput, setUsernameInput] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUsername } = useUser();

  //Toggle between login and register forms
  const toggleRegisterForm = () => {
    setShowRegister(prevState => !prevState);
  };

  //Handle login form submission
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send login credentials to the backend for authentication
      const response = await axios.post('http://localhost:3000/api/login', {
        username: usernameInput,
        password
      });

      // Handle successful login
      setIsLoggedIn(true);
      setUsername(response.data.user.username); // Adjusted access path

      // Store login status in session storage
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', response.data.user.username);
 
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  if (isLoggedIn) {
    // Redirect to home page after successful login
    return <Navigate to="/home" />;
  }

  // JSX for rendering the login form
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
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="  Username" 
                value={usernameInput} 
                onChange={(e) => setUsernameInput(e.target.value)} 
                required 
                style={{ backgroundColor: 'white', borderRadius: '20px' }}
              />
              </div>
              <div className="form-group">
                <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button style={{
                backgroundColor: '#94c2e7',
                color: 'white',
                padding: '12px 25px',
                border: 'none',
                borderRadius: '5px',
                fontFamily: 'Quicksand, sans-serif',
                boxShadow: '0 5px #775936',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: 'none'
              }} type="submit">Login</button>
            </form>
          </div>
        ) : (
          <Register />
        )}
          <form className="login-form">
                <button type="button" onClick={toggleRegisterForm} style={{
                backgroundColor: '#94c2e7',
                color: 'white',
                padding: '12px 25px',
                border: 'none',
                borderRadius: '5px',
                fontFamily: 'Quicksand, sans-serif',
                boxShadow: '0 5px #775936',
                transition: 'all 0.3s ease',
                cursor: 'pointer',   
                boxShadow: 'none'
            }}>
            {showRegister ? 'Already have an account? Login' : 'Don\'t have an account? Sign up'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
