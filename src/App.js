import React from 'react';
import './styles.css';
import { PinProvider } from './PinContext'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './UserContext';
import Login from './Login';
import Home from './Home';

//App component manages routing and provides UserContext to the app
function App() {

  return (
    <UserProvider> 
      <PinProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
      </PinProvider>
    </UserProvider>
  );
}

export default App;
