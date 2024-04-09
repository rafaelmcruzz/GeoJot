import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo.jpg';
import './Home.css';

function Register() {
  // Define state variables for email, username, and password
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

    if (username.length < 4 || username.length > 20) {
      console.error('Username must be between 4 and 20 characters');
      setUsernameErrorMessage('Username must be between 4 and 20 characters');
      return; // Stop the form submission
    }
    
    try {

      // Send the registration data to the backend
      const response = await axios.post('http://localhost:3000/api/register', {
        email,
        username,
        password
      });

      // Handle successful registration
      console.log('User registered successfully:', response.data);
      // Optionally, redirect the user to a different page or display a success message
    } catch (error) {
      
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
        // Generic error handling
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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {usernameErrorMessage && <div className="error">{usernameErrorMessage}</div>}
          {passwordErrorMessage && <div className="error">{passwordErrorMessage}</div>}
          {passwordErrorMessage && <div className="error">Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit.</div>}
          {emailErrorMessage && <div className="error">{emailErrorMessage}</div>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
