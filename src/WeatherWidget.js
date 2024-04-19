import React, { useEffect, useState } from 'react';
import './Home.css';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const apiKey = '0440b62823551fb4d002bf53debd8027';
    
    // Coordinates for Liverpool, England
    const defaultLocation = { lat: 53.4084, lon: -2.9916 };

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        return today.toLocaleDateString("en-US", options); 
      };

    const dateString = getCurrentDate();

    // useEffect to fetch weather data
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                const response = await fetch(url);
                const data = await response.json();
                // Check if the response has the correct structure
                if (data && data.main && data.weather) {
                    setWeather(data);
                } else {
                    console.error('Unexpected response structure:', data);
                }
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
            }
        };

        // Function to get the user's current location
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    () => {
                        console.error("Permission denied or unable to retrieve location. Defaulting to Liverpool, England.");
                        // Use default location (Liverpool) if permission is denied or location is not available
                        fetchWeather(defaultLocation.lat, defaultLocation.lon);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser. Defaulting to Liverpool, England.");
                
                fetchWeather(defaultLocation.lat, defaultLocation.lon);
            }
        };

        getLocation();
    }, [apiKey]);

    if (!weather) return <div>Loading weather...</div>;
    
    // Safely access nested data
    const { name, main: { temp }, weather: [currentWeather] = [{}] } = weather || {};
    const { main: weatherCondition = 'Unavailable', icon } = currentWeather;

    const iconUrl = icon ? `http://openweathermap.org/img/w/${icon}.png` : '';

    return (
    
        <div class="weather-widget">
            <div class="weather-info">
                {icon && <img src={iconUrl} alt="Weather icon" />}
                <div class="weather-details">
                    <p class="weather-city"><strong>{name}</strong></p>
                    <p class="weather-date">{dateString}</p>
                </div>
            </div>
            <p class="weather-temperature"><strong>Temperature:</strong> {temp ? `${temp}°C` : 'N/A'}</p>
            <p class="weather-condition"><strong>Weather:</strong> {weatherCondition}</p>
        </div>
    );
};

export default WeatherWidget;
