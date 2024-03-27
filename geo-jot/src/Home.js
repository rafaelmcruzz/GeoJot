import React from 'react';
import './Home.css'; // Introduce CSS Style Files
import Map from './Map';
import Search from './Search';
import { useUser } from './UserContext';

// LeftSidebar components
function LeftSidebar() {

  const { username } = useUser();
  const avatarUrl = 'user-avatar.jpg';
  

  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={avatarUrl} alt="User Avatar" />
        <p>{username} </p> {/* Display username */}
      </div>
    </div>
  );
}

// Main map interface components
function MainContent() {
  return (
    <div className="main-content">
      <Map />
    </div>
  );
}

// App components
function App() {
  // Use the passed username instead of hardcoding
  return (
    <div className="home">
      <div className="search-bar">
        <Search />
      </div>
      <div className="content-container">
        <LeftSidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
