import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext'; // Ensure this path is correct

const UserProfile = ({ userData }) => {
  const { username } = useUser(); // Use the useUser hook to access the current user's username
  const [isFollowing, setIsFollowing] = useState(userData.followers?.includes(username));
  const [followersCount, setFollowersCount] = useState(userData.followers?.length || 0);

  useEffect(() => {
    // Update the initial state if userData changes
    setIsFollowing(userData.followers?.includes(username));
    setFollowersCount(userData.followers?.length || 0);
  }, [userData, username]);

  const handleFollow = (usernameToFollow) => {
    // Prevent users from following/unfollowing themselves
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
      // Toggle the follow state and update followers count accordingly
      setIsFollowing(!isFollowing);
      setFollowersCount(currentCount => isFollowing ? currentCount - 1 : currentCount + 1);
    })
    .catch(error => {
      console.error(`Error ${action}ing user:`, error);
    });
  };

  return (
    <div style={{ border: '1px solid gray', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <img
        src={userData.profilePicture || "default-profile-picture.png"}
        alt="Profile"
        style={{ borderRadius: '50%', width: '80px', height: '80px', marginBottom: '16px' }}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>Name: {userData.username}</div>
        <div style={{ fontSize: '16px', marginBottom: '4px' }}>{followersCount} followers</div>
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
