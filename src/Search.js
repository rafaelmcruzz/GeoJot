import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const Search = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch users based on the search query
    const fetchUsers = async () => {
      try {
        if (query.length >= 1) { 
          const response = await fetch(`http://localhost:3000/api/users/search?query=${query}`);
          const data = await response.json();
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching user search results:', error);
      }
    };

    fetchUsers();
  }, [query]); 

  // Event listener to close user list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setUsers([]); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // JSX for rendering the search component
  return (
    <div ref={containerRef} className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="search-input"
        style={{ backgroundColor: 'white' }}
      />
      {users.length > 0 && (
        <ul className="search-results">
          {users.map(user => (
            <li
              key={user._id}
              className="search-result-item"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
              onClick={() => onSelectUser(user)}
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
    </div>
  );
};

export default Search;
