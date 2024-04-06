import React, { useState, useEffect} from 'react';
import './Home.css'; // Ensure this path matches your CSS file's location
import { useUser } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserPlus } from '@fortawesome/free-solid-svg-icons';
// npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons

const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore, pinId }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  const { username } = useUser();

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

  /**
   * Invite a collaborator to a pin
   * Asks for the username of the person to invite in a prompt
   * Makes a POST request to the collaborators endpoint of the pin with the username
   * Shows a success/error message based on the response from the server
   */
  const inviteCollaborator = async () => {
    const collaboratorUsername = prompt("Enter the username of the person you want to invite:");
    if (!collaboratorUsername) return;

    console.log("Inviting collaborator", collaboratorUsername, "for pin", pinId);
    try {
      const response = await fetch(`http://localhost:3000/api/pins/${pinId}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collaboratorUsername }),
      });
      console.log("Response received from server:", response);
      if (!response.ok) throw new Error('Failed to invite collaborator');
      console.log("Collaborator invited successfully");
      alert('Collaborator invited successfully');
    } catch (error) {
      console.error("Error inviting collaborator:", error, error.message);
      alert('Failed to invite collaborator');
    }
  };

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
          <input
            id="music"
            type="text"
            value={music} // Use music prop
            readOnly
          />
        </div>
        <button type="button" onClick={onViewMore}>View More</button>
      </div>
      <div className="right-section">
        <div className="thumbnails">
          {mediaFiles && mediaFiles.length > 0 ? (
            mediaFiles.map((fileUrl, index) => (
              <img key={index} src={fileUrl} alt={`Media ${index + 1}`} className="thumbnail" />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="music">
          {songDetails && songDetails.previewUrl && (
            <div className="music-player">
              <img src={songDetails.albumArtUrl} alt="Album Art" className="album-art" />
              <p>{songDetails.title}</p>
              <audio controls src={songDetails.previewUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
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
        <FontAwesomeIcon icon={faUserPlus} className="invite-collaborators" onClick={inviteCollaborator} />
      </div>
    </div>
  );
};

export default Drawing1;
