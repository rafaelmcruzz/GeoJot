import React, { useState, useEffect } from 'react';
import './Home.css';

const Search = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);


const searchResultItems = document.querySelectorAll('.search-result-item');


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
    if (query.length >= 1) { // Only search if query is 2 or more characters
      fetch(`http://localhost:3000/api/users/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
          setUsers(data); // Assuming the data is an array of user objects
      })
        .catch(error => console.error('Error fetching user search results:', error));
    } else {
      setUsers([]); // Clear search results if query is too short
    }
  }, [query]); // Rerun the effect when query changes

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
            <li key={user._id} className="search-result-item" onClick={() => onSelectUser(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
