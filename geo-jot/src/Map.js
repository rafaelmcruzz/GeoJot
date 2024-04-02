import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Form from './Form';
import Drawing1 from './Drawing1';
import Drawing2 from './Drawing2';
import markerIconPng from './Pin.png';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from './UserContext';

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
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const { username } = useUser();

  // In progress 
  // handle updating pins after submitting form data. (Currently need to refresh webpage)
  const handleFormSubmissionSuccess = () => {
    setShowForm(false);
    fetchPins();
  }

  // Function to fetch pins
  const fetchPins = async () => {
    try {
      console.log('Fetching pins for user:', username);
      const response = await fetch(`http://localhost:3000/api/pins?username=${username}`);
      if (response.ok) {
        let pins = await response.json();
        pins = pins.filter(pin => pin.position && pin.position.lat && pin.position.lng);
  
        const pinsWithDetails = await Promise.all(pins.map(async (pin) => {
          // Attempt to fetch details and use an empty object as fallback
          const details = await fetchPinDetails(pin._id) || {};
          return { ...pin, details }; // Safely append details, ensuring it's never undefined
        }));
  
        setMarkers(pinsWithDetails);
      } else {
        console.error('Failed to fetch pins:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };
  
  // Since fetchPinDetails might be used here before its definition, ensure it's defined appropriately
  const fetchPinDetails = async (pinId) => {
    try {
      console.log(`Fetching details for pin with ID: ${pinId}`); // Debugging
      const response = await fetch(`http://localhost:3000/api/pins/details/${pinId}`);
      if (response.ok) {
        const pinDetails = await response.json();
        console.log('Fetched pin details:', pinDetails); // Debugging
        return pinDetails;
      } else {
        console.error('Failed to fetch pin details:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching pin details:', error);
      return null;
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pins/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Logic to update the local state with the new details of the pin
        const updatedMarkers = markers.map(marker =>
          marker._id === formData._id ? { ...marker, ...formData } : marker
        );
        setMarkers(updatedMarkers);
        setShowForm(false);
        setSelectedMarker(null);
      } else {
        console.error('Failed to update pin:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating pin:', error);
    }
  };

  // useEffect to fetch pins when the component mounts
  useEffect(() => {
    if (username) {
      fetchPins(); // Only fetch pins if the username exists
    }
  }, [username]); // Depend on username

  useEffect(() => {
    console.log(selectedMarker);
    // Determine which drawing component to display based on selectedMarker
    if (selectedMarker && selectedMarker.details && (selectedMarker.details.name || selectedMarker.details.notes)) {
      setSelectedDrawing('Drawing1');
    } else {
      setSelectedDrawing(null); // If no details, reset selectedDrawing
    }
  }, [selectedMarker]);

  // Function to handle marker deletion
  const deleteMarker = async (markerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pins/${markerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If the deletion was successful, update the state or UI accordingly
        console.log('Pin successfully deleted');
        setMarkers(currentMarkers => currentMarkers.filter(marker => marker._id !== markerId));
        setSelectedMarker(null); // Reset selected marker after deletion
      } else {
        // Handle cases where the backend responds with an error (e.g., pin not found)
        console.error('Failed to delete pin:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };

  function LocationMarker() {

    const handleMapClick = async (newMarker) => {
      // Assuming your backend expects an object with position and name

      const markerWithUser = { ...newMarker, username, details: {} };

      try {
        const response = await fetch('http://localhost:3000/api/pins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(markerWithUser),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Pin saved successfully:', data);
          // Update the state with the new marker, including the _id returned from the server
          setMarkers((currentMarkers) => [...currentMarkers, { ...markerWithUser, _id: data._id }]);
        } else {
          // Handle server errors or unsuccessful responses
          console.error('Failed to save pin:', await response.text());
        }
      } catch (error) {
          console.error('Error creating pin:', error);
          // Handle any errors, such as by showing an error message to the user.
      }
  };


    useMapEvents({
      contextmenu(e) {
        const newMarker = {
          _id: uuidv4(),
          position: e.latlng,
          name: '', // Initial name is empty
          notes: '', // Initial notes is empty
          music: '', // Initial music is empty
          media: null, // Initial media is null
          username,
        };
        //setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
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

  const handleSelectMarker = (marker) => {
    setSelectedMarker(marker);
    setShowForm(true);
  }

  return (
    <div className="map">
      <MapContainer center={[53.411730, -2.982645]} zoom={13} style={{ height: '955px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker /> {/* Add LocationMarker here */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={customIcon} eventHandlers={{click: () => {setSelectedMarker(marker); setShowForm(true);}}}>
          </Marker>
        ))}
      </MapContainer>
      {showForm && selectedMarker && (
        <div className="modal-backdrop">
          <div className="form-modal">
            <button className="close-button" onClick={() => setShowForm(false)}>X</button>
            {/* Pass the marker details to the drawing form */}
            {selectedDrawing === 'Drawing1' ? (
            <Drawing1
                name={selectedMarker.details.name}
                notes={selectedMarker.details.notes}
                mediaFiles={selectedMarker.details.mediaFiles}
                music={selectedMarker.details.music}
                onViewMore={() => console.log('View More Clicked')}
                onDelete={() => deleteMarker(selectedMarker._id)}
              />
            ) : (
              <Form 
                onSubmit={handleFormSubmit} 
                _id={selectedMarker._id}
                onDelete={() => deleteMarker(selectedMarker._id)} 
                initialName={selectedMarker.details?.name || ''} 
                initialNotes={selectedMarker.details?.notes || ''} 
                initialMusic={selectedMarker.details?.music || ''} 
                initialMediaFiles={selectedMarker.details?.mediaFiles || []}
                onSubmissionSuccess={() => handleFormSubmissionSuccess()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;





