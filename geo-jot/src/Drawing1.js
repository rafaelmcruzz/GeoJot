import React from 'react';
import './Home.css'; // Import the Home.css file

const Drawing1 = () => {
  // Placeholder data
  const pinData = {
    name: "Example Pin",
    notes: "This is an example pin.",
    image: "https://placehold.co/1000x1430",
    song: "https://example.com/song.mp3"
  };

  return (
    <div className="drawing1">
      <div className="left-section">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={pinData.name}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={pinData.notes}
            readOnly
          />
        </div>
        <button type="button" onClick={() => console.log('Edit button clicked')}>Edit</button>
      </div>
      <div className="right-section">
        <div className="image">
          <img src={pinData.image} alt="Pin Image" />
        </div>
        <div className="music">
          <label htmlFor="song">Song:</label>
          <input
            id="song"
            type="text"
            value={pinData.song}
            readOnly
          />
          <button type="button">View Song</button>
        </div>
      </div>
    </div>
  );
};

export default Drawing1;




