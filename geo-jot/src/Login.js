import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import Register from './Register';

function Login() {
  const [showRegister, setShowRegister] = useState(false); // State to track whether to show the register form
  const [username, setUsername] = useState(''); // State to store username input
  const [password, setPassword] = useState(''); // State to store password input

  const toggleRegisterForm = () => {
    setShowRegister(prevState => !prevState);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send login credentials to the backend for authentication
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password
      });

      // Handle successful login - e.g., redirect to dashboard
      console.log('User logged in successfully:', response.data);
    } catch (error) {
      // Handle login error - e.g., display error message to the user
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        {!showRegister ? (
          <div>
            <h2>User Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
  );
}

export default Login;