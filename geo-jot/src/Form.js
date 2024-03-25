import React, { useState } from 'react';
import './styles.css'; // Import the styles.css file

const Form = ({ onSubmit, onEdit }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showMore, setShowMore] = useState(false); // State to control the display of the view more window

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, notes, mediaFiles };

    try {
      await fetch('http://localhost:3000/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setName('');
      setNotes('');
      setMediaFiles([]);
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
            <p>Music: {/* Music information or player */}</p>
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
