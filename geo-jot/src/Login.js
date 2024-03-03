import React, { useState } from 'react';
import './styles.css'; // Import your global CSS file
import Register from './Register'; // Import the Register component

function Login() {
  const [showRegister, setShowRegister] = useState(false); // State to track whether to show the register form

  const toggleRegisterForm = () => {
    setShowRegister(prevState => !prevState);
  };

  return (
    <div className="login-page">
      <div className="form">
        {!showRegister ? (
        <div>
            <h2>User Login</h2>
            <form action="/submit-login" method="post">
                <div className="form-group">
                   <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" required />
             </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="text" id="password" name="password" required />
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


