import React from 'react';
import './styles.css'; // Import your global CSS file
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login'; // Import the Login component
//import Register from './Register';
import Home from './Home';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    // <LoginPage/>
  );
}

export default App;







