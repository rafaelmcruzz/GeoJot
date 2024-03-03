import React from 'react';

function Register() {
  return (
    <div>
      <h2>User Registration</h2>
      <form action="/submit-registration" method="post">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="password-confirm">Confirm Password:</label>
          <input type="password" id="password-confirm" name="password-confirm" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;


