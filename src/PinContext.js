import React, { createContext, useState, useContext, useCallback } from 'react';
import { useUser } from './UserContext';

const PinContext = createContext();

export const usePins = () => useContext(PinContext);


export const PinProvider = ({ children }) => {
  const [recentPins, setRecentPins] = useState([]);
  const { username } = useUser();

  const fetchRecentPins = useCallback(async () => {
    try {
        const response = await fetch(`https://geojotbackend.onrender.com/api/pins/recent?username=${username}`); 
        if (!response.ok) throw new Error('Failed to fetch recent pins');
        const pins = await response.json();
        setRecentPins(pins);
    } catch (error) {
        console.error('Error fetching recent pins:', error);
    }
  }, [username]);

  return (
    <PinContext.Provider value={{ recentPins, fetchRecentPins }}>
      {children}
    </PinContext.Provider>
  );
};
