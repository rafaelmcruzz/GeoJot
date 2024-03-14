import React from 'react';
import './Home.css'; // Introduce CSS Style Files
import Map from './Map';



// LeftSidebar components
function LeftSidebar({ user, addresses, selectedAddress, username }) {
  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={user.avatar} alt="User Avatar" />
        <p>{username} </p> {/* Display username */}
      </div>
      <div className="address-block">
        <h2>My Addresses</h2>
        <ul>
          {addresses.map((address, index) => (
            <li key={index}>
              <p>{address.name}</p>
              {/* Additional address information can be displayed as needed */}
              <p>{address.notes}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="selected-address-details">
        <h2>Selected Address Details</h2>
        <p>Address Name: {selectedAddress.name}</p>
        <p>Address Notes: {selectedAddress.notes}</p>
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
  // Simulate user and address data
  const user = {
    name: 'John Doe',
    avatar: 'user-avatar.jpg',
  };

  const addresses = [
    { name: 'Address 1', notes: 'Notes for Address 1' },
    { name: 'Address 2', notes: 'Notes for Address 2' },
    { name: 'Address 3', notes: 'Notes for Address 3' },
  ];

  const selectedAddress = {
    name: 'Selected Address',
    notes: 'Notes for Selected Address',
  };

  return (
    <div className="app">
      {/* Left side bar */}
      <LeftSidebar user={user} addresses={addresses} selectedAddress={selectedAddress} />
      {/* Main content area*/}
      <MainContent />
    </div>
  );
}

export default App;

