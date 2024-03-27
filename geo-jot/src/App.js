//import React, { useState, useEffect } from 'react';
import React from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './UserContext';
import Login from './Login';
import Home from './Home';

function App() {
  // const [username, setUsername] = useState(''); // Add this line
  // const [isLoggedIn, setIsLoggedIn] = useState(false);


  // useEffect(() => {
  //   const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  //   const storedUsername = sessionStorage.getItem('username');

  //   if (loggedIn && storedUsername) {
  //     setIsLoggedIn(true);
  //     setUsername(storedUsername);
  //   }
  // }, []);


  return (
    <UserProvider> {/* Wrap the Router in UserProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
