import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  // Define state variables for email, username, and password
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('hhihihi')
    
    try {

      console.log('trying')
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
      // Handle registration error
      console.error('Error registering user:', error);
      // Optionally, display an error message to the user
    }
    
    // Reset the form fields
    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
