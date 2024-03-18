import React, { useState, useEffect } from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import Home from './Home';

function App() {
  const [username, setUsername] = useState(''); // Add this line
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = sessionStorage.getItem('username');

    if (loggedIn && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUsername={setUsername} />} /> {/* Modify this line */}
        <Route path="/home" element={<Home username={username} />} /> {/* Modify this line */}
      </Routes>
    </Router>

    
  );
}

export default App;
