import React, { useState, useEffect, useRef } from 'react';
import './Home.css'; 
import { useUser } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserPlus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Form from './Form'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
// npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import CollaboratorInvite from './CollaboratorInvite';

const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore, canEdit, onDelete, pinId, canInvite }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [images, setImages] = useState(mediaFiles || []);
  const [currentIndex, setCurrentIndex] = useState(0);


  const handleAudioPlay = () => {
    if (!songDetails.previewUrl) return; 
    
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      const newAudioPlayer = new Audio(songDetails.previewUrl);
      newAudioPlayer.play()
        .then(() => {
          setAudioPlayer(newAudioPlayer);
          setIsPlaying(true);
        })
        .catch((e) => console.error("Playback failed", e));
    }
  };

  
useEffect(() => {
  setImages(mediaFiles || []);
}, [mediaFiles]);

  

  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);
  
  useEffect(() => {
    if (isPlaying) {
      handleAudioPlay(); 
    }
  }, [songDetails]);
  

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const { username } = useUser();
  console.log("songDetails::", songDetails);


  const handleEdit = () => {
    setIsEditing(true);

  };
  
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`https://geojotbackend.onrender.com/api/pins/${pinId}/likes`);
        if (!response.ok) throw new Error('Failed to fetch likes');
        const data = await response.json();
        setLikes(data.likes || []);
        setLiked(data.likes.includes(username)); 
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [pinId, username]);

  useEffect(() => {
    setLiked(likes.includes(username)); 
  }, [likes, username]);

  const toggleInviteForm = () => setShowInvite(!showInvite);

  const toggleLike = async () => {
    try {
      console.log("currentUser", username);
      const response = await fetch(`https://geojotbackend.onrender.com/api/pins/${pinId}/toggle-like`, {
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
        initialMediaFiles={mediaFiles}
        onSubmissionSuccess={() => setIsEditing(false)} 
      />
    );
  }
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
          {songDetails.albumArtUrl ? (
            <div className="music-details"> 
              <img src={songDetails.albumArtUrl} alt="Album Art" className="album-art" />
              <div className="song-info">
                <div className="song-title">{songDetails.title}</div>
                <div className="song-author">By {songDetails.artists}</div>
                <button
                  onClick={handleAudioPlay}
                  className={`audio-control-button ${!songDetails.previewUrl ? 'disabled' : ''}`}
                  disabled={!songDetails.previewUrl}
                >
                  <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} /> 
                </button>
              </div> 
            </div> 
          ) : (
            <div className="song-not-chosen" style={{fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#203a4c'  }}>Song not chosen</div>
          )}
        </div>


{canEdit && (
    <button 
        type="button" 
        onClick={() => setIsEditing(true)} 
        className="view-more-button" 
        style={{
            backgroundColor: '#94c2e7', 
            color: 'white',
            padding: '11px 25px',
            border: 'none',
            fontFamily: 'Quicksand, sans-serif', 
            transition: 'box-shadow 0.3s ease', 
            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0)',
        }}
        onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0)'}
    >
        Edit
    </button>
)}
        {canEdit && (
          <>
            <button className="delete-button" onClick={onDelete}>Delete Pin</button>
          </>
        )}
      </div>
      <div className="right-section">
      <div className="slideshow-centered">
      {images.length > 0 ? (
        <div className="slideshow-container">
          <img src={images[currentIndex]} alt={`Media ${currentIndex + 1}`} className="slideshow-image" />
          <div className="slideshow-controls">
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevImage} />
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNextImage} />
          </div>
          {images.length > 1 && (
            <div className="slideshow-dots">
              {images.map((_, index) => (
                <span key={index} className={`dot ${currentIndex === index ? 'active' : ''}`} onClick={() => setCurrentIndex(index)}></span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p style={{fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#203a4c'}}>No images available</p>
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

