import React, { useState, useEffect } from 'react';
import './Home.css'; // Ensure this path matches your CSS file's location
import { useUser } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Form from './Form'
// npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import CollaboratorInvite from './CollaboratorInvite';

const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore, onEdit, onDelete, pinId }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);


  const { username } = useUser();
  console.log("songDetails::", songDetails);


  const handleEdit = () => {
    // If managing directly in Drawing1, toggle isEditing state
    setIsEditing(true);

    // If managed by a parent component, call the onEdit prop with pin details
    // onEdit({ pinId, name, notes, music, songDetails });

    // You might also need to manage the display of Form.js at a higher level depending on your app's structure
  };
 
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

  useEffect(() => {
    setLiked(likes.includes(username)); // Update liked state whenever likes array changes
  }, [likes, username]);

  const toggleInviteForm = () => setShowInvite(!showInvite);

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

  if (isEditing) {
    // Directly return Form if managing the edit form here
    // Assuming Form component accepts props for initial values and a callback for successful submission
    return (
      <Form
        _id={pinId}
        initialName={name}
        initialNotes={notes}
        initialMusic={music}
        // Pass other initial values as needed
        onSubmissionSuccess={() => setIsEditing(false)} // Reset editing state on successful submission
      />
    );
  }
  return (
    <div className="drawing1">
      <div className="left-section">
        <div className="form-group">
        <label htmlFor="name" className="pin-name-label">{name}</label>
          {/* <input
            id="name"
            type="text"
            value={name}
            readOnly
          /> */}

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
            // Display this message if songDetails are missing or incomplete
            <div className="song-not-chosen">Song not chosen</div>
          )}
        </div>
        <button type="button" onClick={onViewMore} className="view-more-button">View More</button>
        <button type="button" onClick={handleEdit} className="view-more-button">Edit</button>
        <button class="delete-button" onClick={onDelete}>Delete Pin</button>
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
                {/* <button onClick={toggleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
      <div>{likes.length} like{likes.length !== 1 ? 's' : ''}</div> */}
        <FontAwesomeIcon icon={faUserPlus} className="invite-collaborators" onClick={toggleInviteForm} />
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

