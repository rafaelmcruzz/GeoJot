import React, { useState, useEffect } from 'react';

const Search = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users based on the search query
  useEffect(() => {
    if (query.length > 1) { // Only search if query is 2 or more characters
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
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
              {users.map(user => (
          <li key={user._id} onClick={() => {
            console.log('User clicked:', user.username); // Add this line
            onSelectUser(user);
          }}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
