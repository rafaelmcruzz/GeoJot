import React, { useState, useEffect, useRef } from 'react';
import './Home.css';


const Search = ({ onSelectUser, onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const [isSearchActive, setIsSearchActive] = useState(false);




  useEffect(() => {
    if (!query) {
      setUsers([]);
      setPlaces([]);
      return;
    }
  
    setLoading(true);
    // Fetch users from the backend
    fetch(`https://geojotbackend.onrender.com/api/users/search?query=${query}`)
    .then(response => response.json())
      .then(data => {
        setUsers(data);
      }).catch(err => {
        console.error('Error fetching user search results:', err);
        setError(err);
      });
  
    // Fetch places from the backend
    fetch(`https://geojotbackend.onrender.com/api/places/search?query=${query}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setPlaces(data);
      }).catch(err => {
        console.error('Error fetching place search results:', err);
        setError(err);
      }).finally(() => setLoading(false));
  
  }, [query]);

  // Event listener to close user list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setUsers([]); 
        setPlaces([])
        setIsSearchActive(false);  
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSelectPlace = (placeId) => {
    fetch(`https://geojotbackend.onrender.com/api/places/details/${placeId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const latLng = { lat: data.lat, lng: data.lng };
        onSelectLocation(latLng); 
      })
      .catch(err => {
        console.error('Error fetching place details:', err);
      });
  }

  
  return (
    <div ref={containerRef} className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsSearchActive(true)}
        placeholder="Search users or places..."
        className="search-input"
        style={{ backgroundColor: 'white' }}
      />
  
          {isSearchActive && (
          <div className="search-tabs" style={{ fontSize: '12px' }}>  
            <button
              onClick={() => setActiveTab('users')}
              style={{ fontWeight: activeTab === 'users' ? 'bold' : 'normal', padding: '5px 10px' }}  
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('places')}
              style={{ fontWeight: activeTab === 'places' ? 'bold' : 'normal', padding: '5px 10px' }}  
            >
              Places
            </button>
          </div>
        )}
  
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
  
      {activeTab === 'users' && users.length > 0 && (
        <ul className="search-results">
          {users.map(user => (
            <li
              key={user._id}
              className="search-result-item"
              onClick={() => onSelectUser(user)}
              style={{ cursor: 'pointer', fontFamily: 'Quicksand, sans-serif' }}
            >
              <img
                src={user.profilePic || 'https://geojot.s3.eu-west-1.amazonaws.com/profile-pictures/default-profile-pic.jpg'}
                alt={user.username}
                className="user-profile-pic"
              />
              {user.username}
            </li>
          ))}
        </ul>
      )}
  
      {activeTab === 'places' && places.length > 0 && (
        <ul className="search-results">
          {places.map(place => (
            <li
              key={place.place_id}
              className="search-result-item"
              onClick={() => onSelectPlace(place.place_id)}
              style={{ cursor: 'pointer', fontFamily: 'Quicksand, sans-serif' }}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;