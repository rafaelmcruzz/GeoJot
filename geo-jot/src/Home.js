import React, { useState, useEffect } from 'react';
import './Home.css'; // Make sure your CSS is correctly linked
import Map from './Map';
import WeatherWidget from './WeatherWidget';
import Search from './Search';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import ProfilePicture from './ProfilePicture';


function LeftSidebar() {
  const { username, logout } = useUser();
  const exampleProfilePic = 'https://geojot.s3.eu-west-1.amazonaws.com/profile-pictures/default-profile-pic.jpg';
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [recentPins, setRecentPins] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});
  const [followersCount, setFollowersCount] = useState(0);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');


  useEffect(() => {
    // Only proceed if username is available
    if (!username) return;

    fetch(`http://localhost:3000/api/users/${username}/details`)
      .then(response => response.json())
      .then(data => {
        // Assuming 'data' includes the followers array
        setFollowersCount(data.followers?.length || 0);
      })
      .catch(error => console.error('Error fetching user details:', error));
  }, [username]); 

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

  const handleChangeProfilePicture = () => {
    setShowProfilePicture(true);
  }

  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <div className="profile-picture">
          <img src={exampleProfilePic} alt="User Avatar" onClick={toggleDropdown} />
        </div>
        <p><strong>{username}</strong></p>
        <p>Followers: {followersCount}</p>

      </div>
      {showDropdown && (
        <div className="profile-dropdown">
          <p onClick={handleChangeProfilePicture}>Change Profile Picture</p>
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}
      {showProfilePicture && (
        <div className="ProfilePicture-backdrop" onClick={() => setShowProfilePicture(false)}>
          <div className="ProfilePicture-content" onClick={(e) => e.stopPropagation()}>
            <ProfilePicture username={username} onClose={() => setShowProfilePicture(false)} />
          </div>
        </div>
      )}
      <div class="weather-header">Meteorology</div>
      <WeatherWidget />
      <div className="recent-pins">
        <h3 className="recent-pins-header">Recent Pins</h3>
        {recentPins.map((pin, index) => (
            <div key={pin._id} className={`recent-pin ${index === 0 ? 'first-pin' : ''}`}>
                <div className="pin-icon"></div>
                <div className="pin-details">
                    <p className="pin-name">{pin.name}</p>
                    <p className="location-info">
                        {locationDetails[pin._id] ? `${locationDetails[pin._id].road}, ${locationDetails[pin._id].city}` : 'Loading location...'}
                    </p> 
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
  const [isUserProfileVisible, setUserProfileVisible] = useState(false);


  const onSelectUser = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    // setUserProfileVisible(true); // Show the UserProfile as a modal

  };


  const closeUserProfile = () => {
    setUserProfileVisible(false);
  };

  return (
    <div className="home">
      <div className="search-bar">
        <Search onSelectUser={onSelectUser} />
      </div>
      <div>
        {!isViewingOwnMap && selectedUser && (
          <div className="viewingMessage">
            <p>You are viewing the pins of the user: <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setUserProfileVisible(true)}>{selectedUser.username}</span></p>
          </div>
        )}
      </div>
      <div className="content-container">
        <LeftSidebar />
        <MainContent selectedUser={selectedUser} />
        {/* Ensure other components that belong to the content-container are included */}
      </div>
      {isUserProfileVisible && (
        <div 
          className="modal-backdrop" 
          onClick={closeUserProfile} 
          style={{ 
            display: 'flex', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="user-profile-modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '10px', 
              zIndex: 1001,
              maxWidth: '500px',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <UserProfile userData={selectedUser} />
            <button onClick={closeUserProfile} style={{position: 'absolute', top: '10px', right: '10px'}}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
