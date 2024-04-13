import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        //Retrieve the username from session storage
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Function to log out the user
    const logout = () => {
        sessionStorage.removeItem('username');
        setUsername('');
    }

    return (
        <UserContext.Provider value={{ username, setUsername, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
