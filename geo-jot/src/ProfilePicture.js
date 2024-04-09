import React, { useState } from 'react';
import axios from 'axios';

const ProfilePicture = ({ username, onClose, currentProfilePic, onProfilePicUpdate }) => {
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [file, setFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState({ message: '', type: '' });

    // Function to handle file input change and update the state
    const handlePictureChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setSelectedPicture(e.target.result);
            };

            reader.readAsDataURL(event.target.files[0]);
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setFeedbackMessage({ message: 'Please select a file before submitting.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const response = await axios.put(`http://localhost:3000/api/users/${username}/profile-picture`, formData, {
                method: 'PUT',
            });

            // Handle success
            const newProfilePicUrl = response.data.profilePic;
            setFeedbackMessage({ message: 'Error uploading profile picture.', type: 'error' });
            onProfilePicUpdate(newProfilePicUrl);
            onClose();
        } catch (error) {
            // Handle error
            setFeedbackMessage({ message: 'Error uploading profile picture.', type: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-picture">
            <div className='profile-pictures-container'>
                <div className="current-profile-picture">
                    <p>Current Profile Picture:</p>
                    {/* Display the current profile picture if it exists */}
                    {currentProfilePic && currentProfilePic.profilePicUrl ? (
                        <img src={currentProfilePic.profilePicUrl} alt="Current Profile" style={{ width: '100px', height: '100px' }} />
                    ) : (
                        <p>No current profile picture.</p>
                    )}
                </div>
                <div className="new-profile-picture">
                    <p>New Profile Picture:</p>
                    {selectedPicture ? (
                        <img src={selectedPicture} alt="Profile" />
                    ) : (
                        <p>No picture selected.</p>
                    )}
                </div>
            </div>
            {feedbackMessage.message && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                    {feedbackMessage.message}
                </div>
            )}
            <input type="file" accept="image/*" onChange={handlePictureChange} />
            <button type="submit">Upload</button>
            <button type="button" onClick={onClose}>Close</button>
        </form>
    );
};

export default ProfilePicture;
