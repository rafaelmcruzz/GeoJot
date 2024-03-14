import React from 'react';
import './Home.css'; // Import CSS styles
import Map from './Map';

// LeftSidebar Component
function LeftSidebar({ user }) {
  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={user.avatar} alt="User Avatar" />
        <p>{user.name}</p>
      </div>
    </div>
  );
}

// MainContent Component
function MainContent() {
  return (
    <div className="main-content">
      <Map />
    </div>
  );
}

// Home Component
function Home() {
  // Simulated user data
  const user = {
    name: 'John Doe',
    avatar: 'user-avatar.jpg',
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <LeftSidebar user={user} />
      {/* Main Content Area */}
      <MainContent />
    </div>
  );
}

export default Home;
