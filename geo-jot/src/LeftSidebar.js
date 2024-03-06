import React from 'react';

function LeftSidebar({ user, addresses, selectedAddress }) {
  return (
    <div className="left-sidebar">
      <div className="user-profile">
        <img src={user.avatar} alt="User Avatar" />
        <p>{user.name}</p>
      </div>
      <div className="address-block">
        <h2>My Addresses</h2>
        <ul>
          {addresses.map((address, index) => (
            <li key={index}>
              <p>{address.name}</p>
              {/* 可以根据需要显示其他地址信息 */}
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

export default LeftSidebar;
