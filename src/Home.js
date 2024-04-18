import './Home.css';
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { usePins } from './PinContext';
import Map from './Map';
import WeatherWidget from './WeatherWidget';
import Search from './Search';
import UserProfile from './UserProfile';
import ProfilePicture from './ProfilePicture';
import SettingsModal from './SettingsModal';

//LeftSidebar component includes the user profile, recent pins, and meteorology
function LeftSidebar( {onPinSelect} ) {
  const { username, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  //const [recentPins, setRecentPins] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('https://geojot.s3.eu-west-1.amazonaws.com/profile-pictures/default-profile-pic.jpg');
  const navigate = useNavigate();
  const { recentPins, fetchRecentPins } = usePins();

  // Fetch user details and recent pins when username changes
  useEffect(() => {
    // Only proceed if username is available
    if (!username) return;

    fetch(`https://geojotbackend.onrender.com/api/users/${username}/details`)
      .then(response => response.json())
      .then(data => {
        setFollowersCount(data.followers?.length || 0);
        setProfilePicUrl(data.profilePic || 'https://geojot.s3.eu-west-1.amazonaws.com/profile-pictures/default-profile-pic.jpg');
      })
      .catch(error => console.error('Error fetching user details:', error));
  }, [username]); 

  useEffect(() => {
    fetchRecentPins();
  }, [fetchRecentPins]);

  //Fetch locatuion details for recent pins
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
  
  //Fetch location details for all recent pins
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

  const toggleDropdownOn = () => {
  
    setShowDropdown(true);
  }
  
  const toggleDropdownDown = () => {
   
    setShowDropdown(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  }

  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const handleChangeProfilePicture = () => {
    setShowProfilePicture(true);
  }

  const handleProfilePicUpdate = (newProfilePicUrl) => {
    setProfilePicUrl(newProfilePicUrl);
  };

  useEffect(() => {
    console.log('Recent pins updated', recentPins);
  }, [recentPins]);

  //JSX for the left sidebar
  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <div className="profile-picture">
        <img src={profilePicUrl} alt="User Profile Picture" onMouseEnter={toggleDropdownOn} onMouseLeave={toggleDropdownDown} />
        </div>
        <p><strong>@{username}</strong></p>
        <p>Followers: {followersCount}</p>

      </div>
      {showDropdown && (
       <div className="profile-dropdown" onMouseEnter={toggleDropdownOn} onMouseLeave={toggleDropdownDown}>
       <p onClick={handleChangeProfilePicture}>Change Profile Picture</p>
       <p onClick={toggleSettingsModal}>Settings</p>
       <p onClick={handleLogout}>Logout</p>
     </div>
      )}
      {showProfilePicture && (
        <div className="ProfilePicture-backdrop" onClick={() => setShowProfilePicture(false)}>
          <div className="ProfilePicture-content" onClick={(e) => e.stopPropagation()}>
            <ProfilePicture username={username} onClose={() => setShowProfilePicture(false)} currentProfilePic={{profilePicUrl}} onProfilePicUpdate={handleProfilePicUpdate} />
          </div>
        </div>
      )}
      {showSettingsModal && (
        <SettingsModal username={username} onClose={() => setShowSettingsModal(false)} />
      )}
      <div class="weather-header">Meteorology</div>
      <WeatherWidget />
      <div className="recent-pins">
        <h3 className="recent-pins-header">Recent Pins</h3>
        {recentPins.map((pin, index) => (
            <div key={pin._id} className={`recent-pin ${index === 0 ? 'first-pin' : ''}`} onClick={() => onPinSelect(pin)}>
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

//Component for the main content of the page, which includes the map
function MainContent({ selectedUser, selectedPin, setSelectedPin }) {
  return (
    <div className="main-content">
      <Map selectedUser={selectedUser} selectedPin={selectedPin} setSelectedPin={setSelectedPin} />
    </div>
  );
}

//Main App component that includes the search bar, left sidebar, and main content
function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const { username } = useUser();

  // Determines if the map being viewed is not the current user's
  const isViewingOwnMap = !selectedUser || username === selectedUser.username;
  const [isUserProfileVisible, setUserProfileVisible] = useState(false);

  //Function to handle user selection
  const onSelectUser = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
  };

  //Function to close the user profile modal
  const closeUserProfile = () => {
    setUserProfileVisible(false);
  };

  //JSX for the App component
  return (
    <div className="home">
      <div className="search-bar">
        <Search onSelectUser={onSelectUser} />
      </div>
      <div>
        {!isViewingOwnMap && selectedUser && (
          <div className="viewingMessage" style={{ position: 'fixed', top: '890px', right: '50px', height: '30px'}}>
          <p>You are viewing the pins of the user: <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setUserProfileVisible(true)}>{selectedUser.username}</span></p>
        </div>
        
        
        )}
      </div>
      <div className="content-container">
        <LeftSidebar onPinSelect={setSelectedPin} />
        <MainContent selectedUser={selectedUser} selectedPin={selectedPin} setSelectedPin={setSelectedPin} />
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
            <UserProfile userData={selectedUser} closeUserProfile={closeUserProfile} />
            {/* <button onClick={closeUserProfile} style={{position: 'absolute', top: '10px', right: '10px'}}>X</button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
