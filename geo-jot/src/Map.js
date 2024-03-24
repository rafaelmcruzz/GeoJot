import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Form from './Form';
import markerIconPng from './Pin.png';

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [40, 40],
  iconAnchor: [20, 41],
  popupAnchor: [1, -34],
});

function Map() {
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Function to fetch pins
  const fetchPins = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pins');
      if (response.ok) {
        const pins = await response.json();
        const validPins = pins.filter(pin => pin.position && pin.position.lat && pin.position.lng);
        setMarkers(validPins); // Assuming your backend sends an array of pins
      } else {
        console.error('Failed to fetch pins:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  // useEffect to fetch pins when the component mounts
  useEffect(() => {
    fetchPins();
  }, []); // The empty array ensures this effect runs once on mount

  function LocationMarker() {

    const handleMapClick = async (newMarker) => {
      // Assuming your backend expects an object with position and name
      try {
          const response = await fetch('http://localhost:3000/api/pins', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newMarker),
          });

          const data = await response.json();
          console.log('Pin saved successfully:', data);
          // You might want to do something here upon successful saving,
          // like updating the marker with a response ID or showing a message to the user.
      } catch (error) {
          console.error('Error creating pin:', error);
          // Handle any errors, such as by showing an error message to the user.
      }
  };


    useMapEvents({
      contextmenu(e) {
        const newMarker = {
          position: e.latlng,
          name: '', // Initial name is empty
        };
        setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
        // Call handleMapClick to send the marker to the backend
        handleMapClick(newMarker);
      },
      popupopen() {
        setShowForm(false);
      },
      popupclose() {
        setShowForm(false);
      },
    });

    return null;
  }

  const handleFormSubmit = (formData) => {
    console.log(formData);
    // Update the name of the selected marker
    const updatedMarkers = markers.map(marker =>
      marker === selectedMarker ? { ...marker, name: formData.name } : marker
    );
    setMarkers(updatedMarkers);
    setShowForm(false);
    setSelectedMarker(null);
  };

  return (
    <div className="map">
      <MapContainer center={[53.411730, -2.982645]} zoom={13} scrollWheelZoom={false} style={{ height: '955px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={customIcon}>
            <Popup>
              <button onClick={() => {
                setSelectedMarker(marker);
                setShowForm(true);
              }}>Add Details</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {showForm && selectedMarker && (
        <div className="modal-backdrop">
          <div className="form-modal">
            <button className="close-button" onClick={() => setShowForm(false)}>X</button>
            <Form onSubmit={handleFormSubmit} initialName={selectedMarker.name} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
