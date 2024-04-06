import React, { useState, useEffect} from 'react';
import './Home.css'; // Ensure this path matches your CSS file's location

const Drawing1 = ({ name, notes, mediaFiles = [], music, songDetails, onViewMore, pinId, currentUser }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pins/${pinId}/likes`);
        if (!response.ok) throw new Error('Failed to fetch likes');
        const data = await response.json();
        setLikes(data.likes || []);
        setLiked(data.likes.includes(currentUser)); // Update liked state based on the fetched likes
      } catch (error) {
        console.error("Error fetching likes:", error.message);
      }
    };

    fetchLikes();
  }, [pinId, currentUser]);

  useEffect(() => {
    setLiked(likes.includes(currentUser)); // Update liked state whenever likes array changes
  }, [likes, currentUser]);

  const toggleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pins/${pinId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser }),
      });
      if (!response.ok) throw new Error('Failed to toggle like');

      // Optimistically update the UI
      setLiked(!liked);
      if (liked) {
        setLikes(likes.filter(userId => userId !== currentUser));
      } else {
        setLikes([...likes, currentUser]);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

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
        <div className="form-group">
          <label htmlFor="music">Music:</label>
          <input
            id="music"
            type="text"
            value={music} // Use music prop
            readOnly
          />
        </div>
        <button type="button" onClick={onViewMore}>View More</button>
      </div>
      <div className="right-section">
        <div className="thumbnails">
          {mediaFiles && mediaFiles.length > 0 ? (
            mediaFiles.map((fileUrl, index) => (
              <img key={index} src={fileUrl} alt={`Media ${index + 1}`} className="thumbnail" />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="music">
          {songDetails && songDetails.previewUrl && (
            <div className="music-player">
              <img src={songDetails.albumArtUrl} alt="Album Art" className="album-art" />
              <p>{songDetails.title}</p>
              <audio controls src={songDetails.previewUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
      <button onClick={toggleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
      <div>{likes.length} like{likes.length !== 1 ? 's' : ''}</div>
    </div>
  );
};

export default Drawing1;
