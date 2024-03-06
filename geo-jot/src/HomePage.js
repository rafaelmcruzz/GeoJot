import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function HomePage() {
  return (
    <div style={{ height: '400px' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A sample marker on the map.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default HomePage;
