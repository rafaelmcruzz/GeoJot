// Drawing2.js
import React from 'react';
import './Home.css'; // Import the Home.css file

const Drawing2 = ({ name, notes, music, mediaFiles, onBack }) => {
  // Assume mediaFiles is an array of URLs for images
  const imagesToDisplay = mediaFiles.slice(0, 10); // Limit the number of images to display


  return (
    <div className="drawing2">
      <div className="left-side">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name} // Use name prop
            readOnly
          />
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
          <input
            id="music"
            type="text"
            value={music} // Use music prop
            readOnly
          />
        </div>
        <button type="button" onClick={onBack}>Back</button>
      </div>
      <div className="right-side">
        <div className="image-container">
          {imagesToDisplay.map((url, index) => (
            <img key={index} src={url} alt={`Picture ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drawing2;
