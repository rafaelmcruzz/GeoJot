import React, { useState } from 'react';
import './styles.css'; // Import the styles.css file
const Form = ({ onSubmit, onEdit, _id, initialName = '', initialNotes = '', initialMusic = '', initialMediaFiles = [] }) => {
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [music, setMusic] = useState(initialMusic);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [showMore, setShowMore] = useState(false); // State to control the display of the view more window

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleMusicChange = (e) => {
    setNotes(e.target.value);
  }

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, notes, music, mediaFiles };
  
    // Determine the URL and HTTP method based on the presence of _id
    const url = _id ? `http://localhost:3000/api/pins/${_id}` : 'http://localhost:3000/api/pins';
    const method = _id ? 'PUT' : 'POST';
  
    // Log the type of request being executed
    console.log(`${method} request being executed`);
  
    try {
      await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // If successful, log that the operation was successful
      console.log(`${method} request successful`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  // Function to toggle the display of the view more window
  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter name..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Enter notes..."
            style={{ height: '100px' }} // Inline style to adjust height

          />
        </div>
        <div className="form-group">
          <label htmlFor="media" className="media-label">
            Attach Media:
          </label>
          <input
            type="file"
            id="media"
            onChange={handleMediaChange}
            multiple
          />
        </div>
        {/* Placeholder for the music box, you might need to implement or embed an actual music player based on your API */}
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input
            id="music"
            type="text"
            onChange={handleMusicChange}
            placeholder="Enter music link..."
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onEdit}>Edit</button>
        <button type="button" onClick={handleViewMore}>View More</button>
      </form>
      {showMore && (
        <div className="view-more-window">
          <div className="left-side">
            <p>Name: {name}</p>
            <p>Notes: {notes}</p>
            {/* Display music information or player here based on your API */}
            <p>Music: {music}</p>
          </div>
          <div className="right-side">
            {/* Display images, assuming mediaFiles contains URLs */}
            {mediaFiles.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt="Media" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;