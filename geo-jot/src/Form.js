import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';


// import { FileUploader } from "react-drag-drop-files";


const Form = ({ onSubmit, onDelete, _id, initialMediaFiles = [], onSubmissionSuccess }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [music, setMusic] = useState('');
  const [musicSearchResults, setMusicSearchResults] = useState([]);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles.map(url => (typeof url === 'string' ? { url } : url)));
  const [selectedSongDetails, setSelectedSongDetails] = useState({});
  const mediaInputRef = useRef(null);
  const [nameError, setNameError] = useState('');
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const getInitialSubmits = () => {
    return Number(localStorage.getItem(`submits_${_id}`)) || 0;
  };

  const [numberOfSubmits, setNumberOfSubmits] = useState(getInitialSubmits());


  const handleNameChange = (e) => {
    setName(e.target.value.trim());
  };

  const onDrop = useCallback(acceptedFiles => {
    const maxImages = mediaFiles.length + acceptedFiles.length;
    console.log(maxImages);

    if (maxImages > 9) {
      setErrorMessage('You can only upload a maximum of 9 images.');
      acceptedFiles = acceptedFiles.slice(0, 9 - mediaFiles.length);
    }
    else {
      setErrorMessage(''); 
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setMediaFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = async (fileToRemove) => {
    if (fileToRemove.url) {
      try {
        const response = await fetch(`http://localhost:3000/api/pins/${_id}/remove-image`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: fileToRemove.url }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log('Image removed successfully:', data.message);
          setMediaFiles(currentFiles => currentFiles.filter(f => f !== fileToRemove));
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Failed to remove image:', error.message);
      }
    } else {
      URL.revokeObjectURL(fileToRemove.preview);
      setMediaFiles(currentFiles => currentFiles.filter(f => f !== fileToRemove));
    }
  };

  useEffect(() => {
    return () => {
      mediaFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [mediaFiles]);


  const selectSong = (track) => {
    setMusic(track.name);
    setSelectedSongDetails({
      previewUrl: track.preview_url,
      albumArtUrl: track.album.images[0].url,
      title: track.name,
      artists: track.artists.map((artist) => artist.name).join(", ")
    });

  };
  

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
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
      setMusicSearchResults(data.tracks.items); // This assumes your Spotify search response structure
    } catch (error) {
      console.error('Error fetching music search results:', error);
    }
  };


  // This function will be called when the play button next to a search result is clicked
  const handlePlayPreview = (previewUrl, trackId) => {
    // If there's an audio playing, stop it regardless of which track it is
    if (audioPlayer) {
      audioPlayer.pause();
      setAudioPlayer(null);
      setCurrentlyPlaying(null);
    }
  
    // If the clicked track is not the one that's currently playing, start it
    if (currentlyPlaying !== trackId) {
      const newAudioPlayer = new Audio(previewUrl);
      newAudioPlayer.play()
        .then(() => {
          setCurrentlyPlaying(trackId);
          setAudioPlayer(newAudioPlayer);
        })
        .catch((e) => console.error("Playback failed", e));
    }
  };


  useEffect(() => {
    // This function will be called when the component is unmounted
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);

    // Effect for fetching and setting pin details if editing an existing pin
    useEffect(() => {
      const fetchPinDetails = async () => {
        if (_id) {
          try {
            const response = await fetch(`http://localhost:3000/api/pins/details/${_id}`);
            if (!response.ok) throw new Error('Failed to fetch pin details');
            const data = await response.json();
            setName(data.name || '');
            setNotes(data.notes || '');
            setMusic(data.music || '');
            setSelectedSongDetails(data.selectedSongDetails || {}); // Ensure this is correctly set
            // Populate other fields as necessary
          } catch (error) {
            console.error('Error fetching pin details:', error);
            // Optionally handle error (e.g., displaying a message to the user)
          }
        }
      };
  
      fetchPinDetails();
    }, [_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('notes', notes);
    formData.append('music', music);
    formData.append('selectedSongDetails', JSON.stringify(selectedSongDetails));
    mediaFiles.forEach(file => {
      if (file.file) {
        formData.append('mediaFiles', file.file);
      } else if (file.url) {
        formData.append('existingMediaUrls', file.url);
      }
    });

    const trimmedName = name.trim();
    const isNameValid = trimmedName.length > 2 && trimmedName.length < 21;

    if (!isNameValid) {
      setNameError('Name must be between 3 and 21 characters');
      return;
    }


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

        const newCount = numberOfSubmits + 1;
        localStorage.setItem(`submits_${_id}`, newCount.toString());
        setNumberOfSubmits(newCount);

        if (newCount > 1) {
          window.location.reload();
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
    <div className="form-create">
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
          {nameError && <span className="error">{nameError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Enter notes..."
            style={{ height: '100px', maxHeight: '300px', minHeight: '100px'}}
          />
        </div>
        <div className="form-group">
          <div className="media-container">
            <label style={{textAlign: 'center'}} >Attach Media:</label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {errorMessage && <div className="max-images-message">{errorMessage}</div>}
            <aside>
              <h4 style={{textAlign: 'center'}}>Files</h4>
              <ul className='media-thumbnails'>
                {mediaFiles.map((item, index) => (
                  <li key={index} className='media-thumbnail-item'>
                    <img src={item.preview || item.url} alt={`Media preview ${index}`} style={{width: '100px', height: '100px'}} />
                    <button type="button" onClick={() => removeFile(item)} className="remove-file-btn">Remove</button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
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
          <div className="music-results-container"> 
            {musicSearchResults.length > 0 && (
              <div className="music-search-container">
                {musicSearchResults.map((track) => (
                  <div key={track.id} className="track-container" onClick={() => selectSong(track)}>
                    <img className="track-album-art" src={track.album.images[0].url} alt={track.name} />
                    <div className="track-info">
                      <div className="track-name">{track.name}</div>
                      <div className="track-artists">{track.artists.map((artist) => artist.name).join(', ')}</div>
                    </div>
                    <button
                      className="play-button"
                      type='button' 
                      style={{ color: '#2d7fe3' }}  
                      onClick={(e) => {
                        e.stopPropagation();  
                        handlePlayPreview(track.preview_url, track.id);
                      }}
                    >
                      <FontAwesomeIcon icon={currentlyPlaying === track.id ? faStop : faPlay} />
                    </button>
                  </div>
                ))}
              </div>
          )}
        </div>
        </div>
        <button type="submit" style={{
    backgroundColor: '#94c2e7',  
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',  
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0)'
}} onMouseOver={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.5)'}
   onMouseOut={e => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0)'}>
    Submit
</button>
{onDelete && (
  <button
  type="button"
  onClick={onDelete}
  style={{
    backgroundColor: '#94c2e7',  
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',      
    fontFamily: 'Quicksand, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // For a smooth background color transition
  }}
  onMouseOver={e => e.currentTarget.style.backgroundColor = '#d60606'}
  onMouseOut={e => e.currentTarget.style.backgroundColor = '#94c2e7'}
>
  Delete
</button>

)}      </form>
    </div>
  );
};

export default Form;

