import React, { useState } from "react";
import './Home.css';

//Allows user to invite collaborators to a pin
const CollaboratorInvite = ({ pinId, onClose }) => {

    //Manage state for collaborator username and feedback message
    const [collaboratorUsername, setCollaboratorUsername] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState({ message: '', type: '' });

    //Function to invite a collaborator to the pin
    const inviteCollaborator = async (event) => {
        event.preventDefault();
        if (!collaboratorUsername) return;

        try {
            const response = await fetch(`https://geojotbackend.onrender.com/api/pins/${pinId}/collaborators`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collaboratorUsername }),
            });
            //Feedback message for successful or failed invitation
            if (!response.ok) throw new Error('Failed to invite collaborator');
            setFeedbackMessage({ message: 'Collaborator invited successfully', type: 'success' });
            onClose(); // Close the form upon successful invitation
        } catch (error) {
            //Log error and set feedback message for failed invitation
            console.error("Error inviting collaborator:", error);
            setFeedbackMessage({ message: 'Failed to invite collaborator', type: 'error' });
        }
    };

    //JSX for the CollaboratorInvite component
    return (
        <div className="collaborator-invite-wrapper">
            <form onSubmit={inviteCollaborator} className="invite-form">
                <p>Invite a Collaborator</p>
                <input
                    type="text"
                    placeholder="Collaborator's Username"
                    value={collaboratorUsername}
                    onChange={(e) => setCollaboratorUsername(e.target.value)}
                    required
                />
                <button style={{backgroundColor: '#94c2e7', padding: '12px 25px', borderRadius: '10px', fontSize: '16px'}} type="submit">Invite</button>
                <button style={{backgroundColor: '#94c2e7', padding: '12px 25px', borderRadius: '10px'}} type="button" onClick={onClose}>Cancel</button>
            </form>
            {feedbackMessage.message && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                    {feedbackMessage.message}
                </div>
            )}
        </div>
    );
};

export default CollaboratorInvite;