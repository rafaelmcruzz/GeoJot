import React from 'react';
//import './styles.css'; // Import your global CSS file
import Login from './Login'; // Import the Login component
import Register from './Register';
import Home from './Home';

function App() {
  return (
    <div className="container">
      <div className="form">
        <Home/>
        <Login/>
      </div>
    </div>
  );
}

export default App;







