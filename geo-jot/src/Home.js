import React, { useState } from 'react';
import './Home.css'; // Make sure your CSS is correctly linked
import Map from './Map';
import Search from './Search';
import { useUser } from './UserContext';


function MiniPlayer() {
  // Static song preview URL from Spotify
  const songPreviewUrl = "https://p.scdn.co/mp3-preview/4b0178cf6991f59db18e12e2219ff11e27474b0a?cid=65638501aff3406cab6af040e5ce8b87"; // Replace this with your static song's preview URL
  const albumArtUrl = "https://i.scdn.co/image/ab67616d0000b2739162764a6017634fb155498d"; // Replace with your album art URL
  const songTitle = "FE!N (feat. Playboi Carti)"; // Replace with your song title


  return (
    <div className="mini-player">
      <div className="album-art">
        <img src={albumArtUrl} alt="Album Art" style={{ width: 100, height: 100 }} />
      </div>
      <div className="song-info">
        <p>{songTitle}</p>
      </div>
      <audio controls src={songPreviewUrl}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
function LeftSidebar() {
  const { username } = useUser();
  const avatarUrl = 'user-avatar.jpg';

  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={avatarUrl} alt="User Avatar" />
        <p>{username}</p>
      </div>
      <MiniPlayer /> {/* MiniPlayer added here inside the left sidebar */}
    </div>
  );
}

function MainContent({ selectedUser }) {

  
  // Accept selectedUser as a prop and pass it to Map
  return (
    <div className="main-content">
      <Map selectedUser={selectedUser} />
    </div>
  );
}

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { username } = useUser(); // Get the current user's username
  // Determine if the map being viewed is not the current user's
  const isViewingOwnMap = !selectedUser || username === selectedUser.username;

  const onSelectUser = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
  };

  return (
    <div className="home">
      <div className="search-bar">
        <Search onSelectUser={onSelectUser} />
      </div>
      <div>
      {!isViewingOwnMap && selectedUser && (
        <div className="viewingMessage">
          <p>You are viewing the pins of the user: {selectedUser.username}</p>
        </div>
      )}
      </div>
      <div className="content-container">
        <LeftSidebar />
        <MainContent selectedUser={selectedUser} /> {/* Now correctly passing selectedUser to MainContent */}
      </div>
    </div>
  );
}

export default App;
