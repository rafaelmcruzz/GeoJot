import React, { useState } from 'react';

function Register() {
  // Define state variables for email, username, and password
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [passwordConfirm, setPasswordConfirm] = useState('');

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can send the form data (email, username, password) to your backend for database storage here
    console.log('Form submitted:', { email, username, password });
    // Reset the form fields
    setEmail('');
    setUsername('');
    setPassword('');

    // setPasswordConfirm('');
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
        {/* <div className="form-group">
          <label htmlFor="password-confirm">Confirm Password:</label>
          <input type="password" id="password-confirm" name="password-confirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
        </div> */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
