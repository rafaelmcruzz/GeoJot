import React, { useState, useEffect } from 'react';
import './Home.css'; // Make sure your CSS is correctly linked
import Map from './Map';
import Search from './Search';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';


function LeftSidebar() {
  const { username, logout } = useUser();
  const avatarUrl = 'user-avatar.jpg';
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [recentPins, setRecentPins] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});

  useEffect(() => {
    // Fetch recent pins when the component mounts
    const fetchRecentPins = async () => {
      const response = await fetch(`http://localhost:3000/api/pins/recent?username=${username}`);
      const data = await response.json();
      setRecentPins(data);
    };
  
    fetchRecentPins();
  }, [username]);

  const fetchLocationDetails = async (pin) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pin.position.lat}&lon=${pin.position.lng}&zoom=18&addressdetails=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const road = data?.address?.road || "Unknown Road";
      const city = data?.address?.city || data?.address?.town || data?.address?.village || "Unknown City"; // Fallbacks cover various levels of locality
      return { road, city }; // Return both road and city
    } catch (error) {
      console.error('Error fetching location details:', error);
      return { road: "Unknown Road", city: "Unknown City" };
    }
  };
  
  useEffect(() => {
    const fetchAllLocationDetails = async () => {
      const details = {};
      for (let pin of recentPins) {
        const locationDetail = await fetchLocationDetails(pin);
        details[pin._id] = locationDetail;
      }
      setLocationDetails(details);
    };
  
    if (recentPins.length > 0) {
      fetchAllLocationDetails();
    }
  }, [recentPins]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <div className="profile-picture">
          <img src={avatarUrl} alt="User Avatar" onClick={toggleDropdown} />
        </div>
        <p>{username}</p>
      </div>
      {showDropdown && (
        <div className="profile-dropdown">
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
      <div className="recent-pins">
        <h3 className="recent-pins-header">Recent Pins</h3>
        {recentPins.map(pin => (
          <div key={pin._id} className="recent-pin">
          <div className="pin-icon"></div>
          <div className="pin-details">
            <p className="pin-name">{pin.name}</p> {/* Display pin name */}
            <p className="location-info">
              {locationDetails[pin._id] ? `${locationDetails[pin._id].road}, ${locationDetails[pin._id].city}` : 'Loading location...'}
            </p> {/* Display location info */}
          </div>
        </div>
        ))}
      </div>
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
