import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import './Home.css';

function SettingsModal({ username, onClose }) {
  const [userDetails, setUserDetails] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [statusMessageType, setStatusMessageType] = useState('');
  const navigate = useNavigate();

  //Fetch user details when the component mounts or username changes
  useEffect(() => {
    if (username) { 
      fetch(`https://geojotbackend.onrender.com/api/users/${username}/details`)
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

  //Function to handle changing the user's password
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
      const response = await fetch(`https://geojotbackend.onrender.com/api/users/${username}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        setStatusMessage(data.error);
        setAdditionalInfo(data.additionalInfo);
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

  //Function to handle deleting the user's account
  const handleDeleteAccount = async () => {
    setShowConfirmation(true);

      try {
        const response = await fetch(`https://geojotbackend.onrender.com/api/users/${username}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete account.');
        }
  
        setStatusMessage('Account deleted successfully. Redirecting to home page...');
        setStatusMessageType('success');
        sessionStorage.clear();
        navigate('/');
      } catch (error) {
        setStatusMessage(error.message);
        setStatusMessageType('error');
      }
    
  };

  // JSX for rendering the settings modal
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h1 className="account-title">Account</h1>
        <p><strong>Username: </strong>{userDetails.username}</p>
        <p><strong>Email: </strong>{userDetails.email}</p>
        <h2 className="change-password-title">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input type="password" name="newPassword" placeholder="  New Password" required style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box'
        }}/>
          <input type="password" name="confirmPassword" placeholder="  Confirm New Password" required style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box'
        }}/>
          <button style={{backgroundColor: '#94c2e7', padding: '12px 25px', borderRadius: '10px', fontSize: '16px'}} type="submit">Change Password</button>
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
        <button
    onClick={() => setShowConfirmation(true)}
    className="delete-account-button"
    style={{
        backgroundColor: '#94c2e7',
        borderRadius: '10px',
        padding: '12px 25px',
        border: 'none',
        fontFamily: 'Quicksand, sans-serif',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', // For a smooth background color transition
    }}
    onMouseOver={e => e.currentTarget.style.backgroundColor = '#d60606'}
    onMouseOut={e => e.currentTarget.style.backgroundColor = '#94c2e7'}
>
    Delete Account
</button>
        <button style={{borderRadius: '10px', padding: '12px 25px'}} onClick={onClose}>Close</button>
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
