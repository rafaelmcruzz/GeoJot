import './Home.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';
import Form from './Form'
import CollaboratorInvite from './CollaboratorInvite';

//Component to display the first drawing, display some details and allow some actions
const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore, canEdit, onDelete, pinId, canInvite }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const { username } = useUser();
  
  // Fetch likes for the current pin and update the state
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pins/${pinId}/likes`);
        if (!response.ok) throw new Error('Failed to fetch likes');
        const data = await response.json();
        setLikes(data.likes || []);
        setLiked(data.likes.includes(username)); // Update liked state based on the fetched likes
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [pinId, username]);

  // Update liked state whenever likes array changes
  useEffect(() => {
    setLiked(likes.includes(username));
  }, [likes, username]);

  //Simple function to toggle the invite form
  const toggleInviteForm = () => setShowInvite(!showInvite);

  //Function to toggle the like of the current pin
  const toggleLike = async () => {
    try {
      console.log("currentUser", username);
      const response = await fetch(`http://localhost:3000/api/pins/${pinId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ userId: username }),
      });
      if (!response.ok) throw new Error('Failed to toggle like');

      // Optimistically update the UI
      setLiked(!liked);
      if (liked) {
        setLikes(likes.filter(userId => userId !== username));
      } else {
        setLikes([...likes, username]);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  //If editing mode is active, show the form to edit the pin
  if (isEditing) {
    return (
      <Form
        _id={pinId}
        initialName={name}
        initialNotes={notes}
        initialMusic={music}
        onSubmissionSuccess={() => setIsEditing(false)} // Reset editing state on successful submission
      />
    );
  }

  // JSX for rendering the drawing details and actions
  return (
    <div className="drawing1">
      <div className="left-section">
        <div className="form-group">
          <label htmlFor="name" className="pin-name-label">{name}</label>
          <label htmlFor="name" className="pin-name-label">{name}</label>

        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          {songDetails && songDetails.albumArtUrl ? (
            <div className="music-details">
              <img src={songDetails.albumArtUrl} alt="Album Art" className="album-art" />
              <div className="song-info">
                <div className="song-title">{songDetails.title}</div>
                <div className="song-author">By {songDetails.artists}</div>
                <audio controls src={songDetails.previewUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ) : (
            <div className="song-not-chosen">Song not chosen</div>
          )}
        </div>
        <button type="button" onClick={onViewMore} className="view-more-button">View More</button>
        {canEdit && (
          <>
            <button type="button" onClick={() => setIsEditing(true)} className="view-more-button">Edit</button>
            <button className="delete-button" onClick={onDelete}>Delete Pin</button>
          </>
        )}
      </div>
      <div className="right-section">
        <div className="thumbnails">
          {mediaFiles && mediaFiles.length > 0 ? (
            mediaFiles.slice(0, 3).map((fileUrl, index) => (
              <img key={index} src={fileUrl} alt={`Media ${index + 1}`} className="thumbnail" />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>
      <div className="action-buttons">
        <div onClick={toggleLike} className="like-button">
          <FontAwesomeIcon icon={faThumbsUp} className={`like-icon ${liked ? 'liked' : ''}`} />
          <div>{likes.length}</div>
        </div>
        {canInvite && (
          <FontAwesomeIcon icon={faUserPlus} className="invite-collaborators" onClick={toggleInviteForm} />
        )}
        {showInvite && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <CollaboratorInvite
                pinId={pinId}
                onClose={() => setShowInvite(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawing1;
