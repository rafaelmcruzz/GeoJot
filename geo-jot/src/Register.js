import React, { useState } from 'react';

import axios from 'axios';
import logo from './logo.jpg';
import './Home.css';

function Register() {
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');


  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUsernameErrorMessage(''); 
    setPasswordErrorMessage('');
    setEmailErrorMessage('');

    // Validate the username length
    if (username.length < 4 || username.length > 20) {
      console.error('Username must be between 4 and 20 characters');
      setUsernameErrorMessage('Username must be between 4 and 20 characters');
      return;
    }
    
    try {

      const response = await axios.post(`https://geojotbackend.onrender.com/api/register`, {
        email,
        username,
        password
      });

      // Handle successful registration
      console.log('User registered successfully:', response.data);
      window.location.reload(); //Reload the page to show the login form

    } catch (error) {
      
      //Handle registration errors from backend
      if (error.response) {
        const message = error.response.data.error;
        if (message.includes('Username')) {
          setUsernameErrorMessage(message);
        } else if (message.includes('Password')) {
          setPasswordErrorMessage(message);
        } else if (message.includes('Email')) {
          setEmailErrorMessage(message);
        }
      } else {
        console.error("An unexpected error occurred.", error);
      }
    }
    
    // Reset the form fields
    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <img src={logo} class="logo" />
      <h2 type="title">User Registration</h2>
      <form onSubmit={handleSubmit} autocomplete="off">
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder="  Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder="  Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box'
        }} />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="  Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box'
        }} />
          {usernameErrorMessage && <div className="error">{usernameErrorMessage}</div>}
          {passwordErrorMessage && <div className="error">{passwordErrorMessage}</div>}
          {passwordErrorMessage && <div className="error">Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit.</div>}
          {emailErrorMessage && <div className="error">{emailErrorMessage}</div>}
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
    }}
    type="submit"
    onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
    onMouseOut={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0)'}
>
    Register
</button>

      </form>
    </div>
  );
}

export default Register;
