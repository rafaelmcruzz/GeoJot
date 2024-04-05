import React from 'react';
import './Home.css'; // Ensure this path matches your CSS file's location

const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore}) => {

  console.log("songDetails:", songDetails);

  return (
    <div className="drawing1">
      <div className="left-section">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            readOnly
          />
          <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input
            id="music"
            type="text"
            value={music} // Use music prop
            readOnly
          />
        </div>
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
    </div>
  );
};

export default Drawing1;
