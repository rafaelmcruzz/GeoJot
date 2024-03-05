import React from 'react';
import './App.css'; // 引入 CSS 样式文件


// LeftSidebar 组件
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

// 主界面组件
function MainContent() {
  return (
    <div className="main-content">
      {/* 这里添加地图组件 */}
      <div className="map">
        {/* 添加地图内容 */}
      </div>
    </div>
  );
}

// App 组件
function App() {
  // 模拟用户和地址数据
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
      {/* 左侧栏 */}
      <LeftSidebar user={user} addresses={addresses} selectedAddress={selectedAddress} />
      {/* 主内容区 */}
      <MainContent />
    </div>
  );
}

export default App;
