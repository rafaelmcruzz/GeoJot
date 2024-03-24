import React, { useState } from 'react';
import './styles.css'; // Import the styles.css file

const Form = ({ onSubmit }) => {
  const [notes, setNotes] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  // In Form.js, adjust the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = { notes }; // Assuming we're only dealing with notes for simplicity

  // Here, you would call the backend API to save the notes
  // For demonstration, let's assume your API endpoint is `/api/pins`
  try {
    await fetch('http://localhost:3000/api/pins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Clear form fields after successful submission
    setNotes('');
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


  return (
    <div className="form"> {/* Adds the 'form' class for overall styling */}
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Form;
