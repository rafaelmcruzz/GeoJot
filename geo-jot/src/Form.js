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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { notes, mediaFiles };
    onSubmit(formData);

    // Clear form fields after submission if needed
    setNotes(''); 
    setMediaFiles([]); 
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
