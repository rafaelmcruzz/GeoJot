import React, { useState, useRef } from 'react';
import './styles.css';

const Form = ({ onSubmit, onDelete, _id, initialName = '', initialNotes = '', initialMusic = '', initialMediaFiles = [], onSubmissionSuccess }) => {
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [music, setMusic] = useState(initialMusic);
  const [musicSearchResults, setMusicSearchResults] = useState([]);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [selectedSongDetails, setSelectedSongDetails] = useState({});
  const mediaInputRef = useRef(null);

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

  const handleMusicChange = async (e) => {
    const query = e.target.value;
    setMusic(query);

    if (!query) {
      setMusicSearchResults([]);
      return;
    }

    try {
      const url = `http://localhost:3000/api/spotify/search?query=${encodeURIComponent(query)}`;
      console.log(`Making request to: ${url}`); // Log for debugging
      const response = await fetch(url);
      const data = await response.json();
      console.log(data); // Log the response data for debugging
      setMusicSearchResults(data.tracks.items); // This assumes your Spotify search response structure
    } catch (error) {
      console.error('Error fetching music search results:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('notes', notes);
    formData.append('music', music);
    formData.append('selectedSongDetails', JSON.stringify(selectedSongDetails));
    mediaFiles.forEach(file => formData.append('mediaFiles', file));

    try {
      const response = await fetch(`http://localhost:3000/api/pins${_id ? `/${_id}` : ''}`, {
        method: _id ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(`${_id ? 'Update' : 'Create'} request successful`);
        setName('');
        setNotes('');
        setMusic('');
        setMediaFiles([]);
        setSelectedSongDetails({});
        if (mediaInputRef.current) {
          mediaInputRef.current.value = '';
        }

        // Call the onSubmissionSuccess callback provided by the parent component
        if (typeof onSubmissionSuccess === 'function') {
          onSubmissionSuccess();
        }
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
            style={{ height: '100px' }}
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
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input
            id="music"
            type="text"
            value={music}
            onChange={handleMusicChange}
            placeholder="Search music..."
          />
          {musicSearchResults.length > 0 && (
            <ul className="music-search-results">
              {musicSearchResults.map((track) => (
                <li key={track.id} onClick={() => {
                  setMusic(track.name); // Keep storing the song name as before
                  setSelectedSongDetails({ // Store additional song details
                    previewUrl: track.preview_url,
                    albumArtUrl: track.album.images[0].url, // Assuming you want the first (largest) image
                    title: track.name
                  });
                }}>
                  {track.name} by {track.artists.map(artist => artist.name).join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Submit</button>
        {onDelete && <button type="button" onClick={onDelete}>Delete</button>}
      </form>
    </div>
  );
};

export default Form;

