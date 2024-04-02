// Drawing1.js
import React from 'react';
import './Home.css'; // Import the Home.css file

const Drawing1 = ({ name, notes, mediaFiles = [], music, onViewMore, onDelete }) => {
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
        </div>
        <button type="button" onClick={() => console.log('Edit button clicked')}>Edit</button>
      </div>
      <div className="right-section">
        {/* Shows multiple images side by side to test for Drawing2 */}
        <div className="thumbnails" style={{ minHeight: '100px' }}>
          {/* { Map through mediaFiles to display thumbnails  */}
          {
            mediaFiles.length > 0 ? (
              mediaFiles.map((fileUrl, index) => (
                fileUrl && <img key={index} src={fileUrl} alt={`Media ${index + 1}`} className="thumbnail" />
              ))
            ) : (
              // Display text if no images are available
              <p style={{ textAlign: 'center', lineHeight: '100px' }}>No images available</p>
            )
          }
        </div>
        <div className="music">
          <label htmlFor="song">Song:</label>
          <input
            id="song"
            type="text"
            value={music}
            readOnly
          />
          <button type="button" onClick={onViewMore}>View More</button>
          <button type="button" onClick={onDelete}>Delete Pin</button>
        </div>
      </div>
    </div>
  );
};

export default Drawing1;









