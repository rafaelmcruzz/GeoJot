import React, { useState } from "react";

const CollaboratorInvite = ({ pinId, onClose }) => {
    const [collaboratorUsername, setCollaboratorUsername] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState({ message: '', type: '' });

    const inviteCollaborator = async (event) => {
        event.preventDefault();
        if (!collaboratorUsername) return;

        try {
            const response = await fetch(`http://localhost:3000/api/pins/${pinId}/collaborators`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collaboratorUsername }),
            });
            if (!response.ok) throw new Error('Failed to invite collaborator');
            setFeedbackMessage({ message: 'Collaborator invited successfully', type: 'success' });
            onClose(); // Close the form upon successful invitation
        } catch (error) {
            console.error("Error inviting collaborator:", error);
            setFeedbackMessage({ message: 'Failed to invite collaborator', type: 'error' });
        }
    };

    return (
        <>
            <form onSubmit={inviteCollaborator} className="invite-form">
                <input
                    type="text"
                    placeholder="Enter collaborator's username"
                    value={collaboratorUsername}
                    onChange={(e) => setCollaboratorUsername(e.target.value)}
                    required
                />
                <button type="submit">Invite</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
            {feedbackMessage.message && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                    {feedbackMessage.message}
                </div>
            )}
        </>
    );
};

export default CollaboratorInvite;