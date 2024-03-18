import React from 'react';
import './Home.css'; // Introduce CSS Style Files
import Map from './Map';

// LeftSidebar components
function LeftSidebar({ user, username }) {
  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={user.avatar} alt="User Avatar" />
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
function App(props) {
  // Use the passed username instead of hardcoding
  const user = {
    name: props.username, // Fallback to 'John Doe' if username is not provided
    avatar: 'user-avatar.jpg',
  };

  return (
    <div className="app">
      <LeftSidebar user={user} username={user.name} />
      <MainContent />
    </div>
  );
}

export default App;
