import React, { useState } from 'react';
import './styles.css'; // Import the styles.css file

const Form = ({ onSubmit, onEdit }) => {
  const [name, setName] = useState(''); // New state for name input
  const [notes, setNotes] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);

  // Handle change for the name input
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

  // Adjusted to include name in the submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, notes, mediaFiles }; // Now includes name and mediaFiles

    // Assuming the API can handle name and mediaFiles now
    try {
      await fetch('http://localhost:3000/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Clear form fields after successful submission
      setName('');
      setNotes('');
      setMediaFiles([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form"> {/* Adds the 'form' class for overall styling */}
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
        <button type="submit">Submit</button>
        <button type="button" onClick={onEdit}>Edit</button> {/* New edit (return) button */}
      </form>
    </div>
  );
};

export default Form;

