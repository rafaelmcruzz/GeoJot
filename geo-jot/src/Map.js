import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Form from './Form'; // Ensure Form is properly imported
import markerIconPng from './Pin.png'; // Ensure you have a marker icon image

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Map() {
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      contextmenu(e) {
        const newMarker = e.latlng;
        setMarkers([...markers, newMarker]);
      },
      popupopen() {
        setShowForm(true);
      },
      popupclose() {
        setShowForm(false);
      },
    });

    return null;
  }

  const handleFormSubmit = (formData) => {
    console.log(formData);
    // Here you can handle the submission, e.g., saving the data to the server
    setShowForm(false); // Close the form after submission
    setSelectedPosition(null); // Reset selected position
  };

  return (
    <div className="map">
      <MapContainer center={[53.411730, -2.982645]} zoom={13} scrollWheelZoom={false} style={{ height: '955px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {markers.map((position, idx) => (
          <Marker key={idx} position={position} icon={customIcon}>
            <Popup>
              <button onClick={() => setSelectedPosition(position)}>Add Details</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {showForm && selectedPosition && (
        <div className="modal-backdrop">
          <div className="form-modal">
            <button onClick={() => setShowForm(false)}>Close</button> {/* Close button */}
            <Form onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
