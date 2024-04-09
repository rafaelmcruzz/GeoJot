import React from 'react';
import './Home.css'; // Import the Home.css file

const Drawing2 = ({ name, notes, music, mediaFiles, onBack, songDetails }) => {
  // Assume mediaFiles is an array of URLs for images
  const imagesToDisplay = mediaFiles && mediaFiles.slice(0, 9); // Display only the first 9 images

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
            value={notes} // Use notes prop
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
            // Display this message if songDetails are missing or incomplete
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
            <p>Loading images...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawing2;
