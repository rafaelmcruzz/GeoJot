import React from 'react';
import './Home.css'; // Import the Home.css file

const Drawing2 = () => {
  const exampleData = {
    name: "Example Name",
    notes: "These are example notes.",
    music: "https://example.com/music.mp3",
    pictures: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ]
  };

  // Limit the number of images to be displayed to 10
  const imagesToDisplay = exampleData.pictures.slice(0, 10);

  return (
    <div className="drawing2">
      <div className="left-side">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={exampleData.name}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={exampleData.notes}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input
            id="music"
            type="text"
            value={exampleData.music}
            readOnly
          />
        </div>
      </div>
      <div className="right-side">
        {/* Display Multiple Pictures */}
        <div className="image-container">
          {imagesToDisplay.map((url, index) => (
            <img key={index} src={url} alt={`Picture ${index + 1}`} />
          ))}
        </div>
        {/* Slide buttons (next/previous) */}
        {/* Maximum 10 pictures */}
      </div>
    </div>
  );
};

export default Drawing2;