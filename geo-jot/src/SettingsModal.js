import React, { useEffect, useState } from 'react';
import './Home.css'; // Make sure your CSS is correctly linked

function SettingsModal({ username, onClose }) {
  const [userDetails, setUserDetails] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [statusMessageType, setStatusMessageType] = useState('');

  useEffect(() => {
    if (username) { // Ensure username is not undefined
      fetch(`http://localhost:3000/api/users/${username}/details`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUserDetails(data);
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }, [username]);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    setStatusMessage('');
    setStatusMessageType('');

    if (newPassword !== confirmPassword) {
      setStatusMessage('New passwords do not match.');
      setStatusMessageType('error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${username}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to change password.');
      }

      const data = await response.json();
      setStatusMessage(data.message || 'Password updated successfully.');
      setStatusMessageType('success');
    } catch (error) {
      setStatusMessage(error.message);
      setStatusMessageType('error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Account</h2>
        <p><strong>Username: </strong>{userDetails.username}</p>
        <p><strong>Email: </strong>{userDetails.email}</p>
        <form onSubmit={handleChangePassword}>
          <input type="password" name="newPassword" placeholder="New Password" required />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
          <button type="submit">Change Password</button>
          {statusMessage && (
            <div style={{ color: statusMessageType === 'error' ? 'red' : 'green', marginTop: '10px' }}>
              {statusMessage}
            </div>
          )}
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SettingsModal;
