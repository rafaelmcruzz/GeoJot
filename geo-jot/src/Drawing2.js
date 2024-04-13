import React from 'react';
import './Home.css';

// Component to display the second drawing, display all details and allow to return to the first drawing
const Drawing2 = ({ name, notes, mediaFiles, onBack, songDetails }) => {

  const imagesToDisplay = mediaFiles && mediaFiles.slice(0, 9); // Display only the first 9 images

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
        <button className='back-button' type="button" onClick={onBack}>Back</button>
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
