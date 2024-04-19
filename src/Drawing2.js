import React, { useState, useEffect } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

// Component to display the second drawing, display all details and allow to return to the first drawing
const Drawing2 = ({ name, notes, mediaFiles, onBack, songDetails }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);

  const imagesToDisplay = mediaFiles && mediaFiles.slice(0, 9); // Display only the first 9 images


  const handleAudioPlay = () => {
    if (isPlaying) {
      // If the music is playing, pause it and update the state
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      // If the music is not playing, start it and update the state
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

  // JSX for rendering the drawing details and back action
  return (
    <div className="drawing2">
      <div className="left-side">
        <div className="form-group">
        <label htmlFor="name" className="pin-name-label">{name}</label>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            readOnly
            style={{ height: '100px' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          {songDetails && songDetails.previewUrl ? (
            <div className="music-details">
              <img src={songDetails.albumArtUrl} alt="Album Art" className="album-art" />
              <div className="song-info">
                <div className="song-title">{songDetails.title}</div>
                <div className="song-author">By {songDetails.artists}</div>
                <button onClick={handleAudioPlay} className="audio-control-button">
                  <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
                </button>
              </div>
            </div>
          ) : (
            <div className="song-not-chosen">Song not chosen</div>
)}
        </div>
        <button 
    className='view-more-button' 
    type="button" 
    style={{
        backgroundColor: '#94c2e7',  
        color: 'white',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '5px',
        fontFamily: 'Quicksand, sans-serif',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: 'none'
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
    onMouseOut={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0)'}
 onClick={onBack} >Back</button> 
      </div>
      <div className="right-side">
        <div className="image-container"> 
          {imagesToDisplay ? (
            imagesToDisplay.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index + 1}`} />
            ))
          ) : (
            <p>No images uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawing2;
