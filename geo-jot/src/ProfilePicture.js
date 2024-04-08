import React, { useState } from 'react';
import axios from 'axios';

const ProfilePicture = ({ username, onClose }) => {
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [file, setFile] = useState(null);

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
        console.log('handleSubmit called');

        console.log('File selected:', file);
        console.log('Username:', username);

        if (!file) {
            console.log('No file selected');
            alert('Please select a file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            console.log('Sending request to backend...');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            const response = await axios.put(`http://localhost:3000/api/users/${username}/profile-picture`, formData, {
                method: 'PUT',
            });
            console.log('Response from backend:', response); // For debugging

            // Handle success
            console.log('Successfully uploaded profile picture!', response.data);
            alert('Profile picture updated successfully!');
            onClose();
        } catch (error) {
            // Handle error
            console.error('Error uploading profile picture:', error);
            console.log('Error:', error); // For debugging
            alert('Error uploading profile picture.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-picture">
            {selectedPicture ? (
                <img src={selectedPicture} alt="Profile" />
            ) : (
                <p>No profile picture selected.</p>
            )}
            <input type="file" accept="image/*" onChange={handlePictureChange} />
            <button type="submit">Upload</button>
            <button type="button" onClick={onClose}>Close</button>
        </form>
    );
};

export default ProfilePicture;
