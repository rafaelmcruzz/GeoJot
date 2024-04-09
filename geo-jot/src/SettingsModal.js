import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import './Home.css'; // Make sure your CSS is correctly linked

function SettingsModal({ username, onClose }) {
  const [userDetails, setUserDetails] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [statusMessageType, setStatusMessageType] = useState('');
  const navigate = useNavigate();

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
    setAdditionalInfo('');
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
        const data = await response.json();
        setStatusMessage(data.error);
        setAdditionalInfo(data.additionalInfo); // Assuming the server sends additional info under this key
        setStatusMessageType('error');
        return;
      }

      const data = await response.json();
      setStatusMessage(data.message || 'Password updated successfully.');
      setStatusMessageType('success');
    } catch (error) {
      setStatusMessage(error.message);
      setStatusMessageType('error');
    }
  };

  const handleDeleteAccount = async () => {
    setShowConfirmation(true);

      try {
        const response = await fetch(`http://localhost:3000/api/users/${username}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete account.');
        }
  
        setStatusMessage('Account deleted successfully. Redirecting to home page...');
        setStatusMessageType('success');
        sessionStorage.clear();
        // Log the user out or redirect them to a goodbye or login page
        navigate('/');
      } catch (error) {
        setStatusMessage(error.message);
        setStatusMessageType('error');
      }
    
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h1 className="account-title">Account</h1>
        <p><strong>Username: </strong>{userDetails.username}</p>
        <p><strong>Email: </strong>{userDetails.email}</p>
        <h2 className="change-password-title">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input type="password" name="newPassword" placeholder="New Password" required />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
          <button type="submit">Change Password</button>
          {statusMessage && (
            <div style={{ color: statusMessageType === 'error' ? 'red' : 'green', marginTop: '2px', fontSize: '14px' }}>
              {statusMessage}
            </div>
          )}
          {additionalInfo && (
            <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
              {additionalInfo}
            </div>
          )}
        </form>
        <button onClick={() => setShowConfirmation(true)} className="delete-account-button">
          Delete Account
        </button>
        <button onClick={onClose}>Close</button>
        {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          message={<span>Are you sure you want to delete your account? <b><i>This cannot be undone.</i></b></span>}
          
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
      </div>
    </div>
  );
}

export default SettingsModal;
