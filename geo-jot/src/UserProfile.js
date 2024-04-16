import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './styles.css';

const UserProfile = ({ userData, closeUserProfile }) => {
  const { username } = useUser();
  const [isFollowing, setIsFollowing] = useState(userData.followers?.includes(username));
  const [followersCount, setFollowersCount] = useState(userData.followers?.length || 0);
  const [profilePic, setProfilePic] = useState('https://geojot.s3.eu-west-1.amazonaws.com/profile-pictures/default-profile-pic.jpg'); // Default profile picture
  


  useEffect(() => {
    // Update the initial state if userData changes
    setIsFollowing(userData.followers?.includes(username));
    setFollowersCount(userData.followers?.length || 0);
  }, [userData, username]);

  useEffect(() => {
    if (userData && userData.username) {
      fetch(`http://localhost:3000/api/users/search?query=${encodeURIComponent(userData.username)}`)
        .then(response => response.json())
        .then(data => {
          const user = data.find(u => u.username === userData.username);
          if (user && user.profilePic) {
            setProfilePic(user.profilePic);
          }
        })
        .catch(error => {
          console.error('Error fetching user profile picture:', error);
        });
    }
  }, [userData.username]); 

  const handleFollow = (usernameToFollow) => {
    if (username === usernameToFollow) {
      return;
    }

    const action = isFollowing ? 'unfollow' : 'follow';

    fetch(`http://localhost:3000/api/users/${usernameToFollow}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ follower: username }),
    })
    .then(response => response.json())
    .then(data => {
      setIsFollowing(!isFollowing);
      setFollowersCount(currentCount => isFollowing ? currentCount - 1 : currentCount + 1);
    })
    .catch(error => {
      console.error(`Error ${action}ing user:`, error);
    });
  };


  // JSX for rendering the user profile
  return (
    <div style={{ position: "relative", border: '1px solid gray', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <button className="close-button" onClick={closeUserProfile} 
            >
        X
    </button>
      <img
        src={profilePic}
        alt="Profile"
        style={{ borderRadius: '50%', width: '80px', height: '80px', marginBottom: '16px' }}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px', fontFamily:'Quicksand, sans-serif' }}>{userData.username}</div>
        <div style={{ fontSize: '16px', marginBottom: '4px', fontFamily:'Quicksand, sans-serif' }}>{followersCount} followers</div>
        {username && username !== userData.username && (
          <button onClick={() => handleFollow(userData.username)} style={{ marginTop: '10px' }}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
