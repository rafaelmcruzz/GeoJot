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
      const response = await axios.post(`https://geojotbackend.onrender.com/api/login`, {
        username: usernameInput,
        password
      });

      // Handle successful login
      setIsLoggedIn(true);
      setUsername(response.data.user.username); 

      // Store login status in session storage
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', response.data.user.username);
 
    } catch (error) {
      console.error(`https://geojotbackend.onrender.com/api/login`, error);
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
            <form onSubmit={handleLoginSubmit} autocomplete="off">
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
    <input 
        type="password" 
        id="password" 
        name="password" 
        placeholder="  Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required
        style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box'
        }}
    />
</div>

              <button 
    style={{
        backgroundColor: '#94c2e7',
        color: 'white',
        padding: '14px 25px',
        border: 'none',
        borderRadius: '10px',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: 'none',
    }}
    type="submit"
    onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
    onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
>
    Login
</button>

            </form>
          </div>
        ) : (
          <Register />
        )}
          <form className="login-form">
    <button 
        type="button" 
        onClick={toggleRegisterForm} 
        style={{
            backgroundColor: '#94c2e7',
            color: 'white',
            padding: '14px 25px',
            border: 'none',
            borderRadius: '10px',
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        }}
        onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
    >
        {showRegister ? 'Already have an account? Login' : 'Don\'t have an account? Sign up'}
    </button>
</form>

      </div>
    </div>
    </div>
  );
}

export default Login;
