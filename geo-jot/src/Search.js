import React, { useState, useEffect } from 'react';
import './Home.css';

const Search = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);


  const searchResultItems = document.querySelectorAll('.search-result-item');

  //Handle mouse enter and leave events for search result items
  searchResultItems.forEach(item => {
    
    item.addEventListener('mouseenter', () => {
      
      item.style.transform = 'scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
      
      item.style.transform = 'scale(1)';
    });
  });


  // Fetch users based on the search query
  useEffect(() => {
    if (query.length >= 1) { 
      fetch(`http://localhost:3000/api/users/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
          setUsers(data);
      })
        .catch(error => console.error('Error fetching user search results:', error));
    } else {
      setUsers([]);
    }
  }, [query]); // Rerun the effect when query changes

  // JSX for rendering the search component
  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="search-input"
      />
        {users.length > 0 && (
          <ul className="search-results">
            {users.map(user => (
              <li key={user._id} className="search-result-item" style={{fontFamily: 'Quicksand, sans-serif'}}onClick={() => onSelectUser(user)}>
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
