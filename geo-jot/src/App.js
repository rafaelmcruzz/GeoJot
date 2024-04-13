//import React, { useState, useEffect } from 'react';
import React from 'react';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './UserContext';
import Login from './Login';
import Home from './Home';

function App() {



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
