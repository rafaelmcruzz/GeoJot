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




function Map({ selectedUser }) {
  console.log("Selected user map", selectedUser);
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const { username } = useUser();
  const { username: currentUsername } = useUser();

  const isViewingOwnMap = currentUsername === (selectedUser ? selectedUser.username : currentUsername);

  // In progress 
  // handle updating pins after submitting form data. (Currently need to refresh webpage)
  const handleFormSubmissionSuccess = () => {
    setShowForm(false);
    fetchPins();
  }

  const viewMoreHandler = () => {
    // Logic to transition from Drawing1 to Drawing2 with the same data
    setSelectedDrawing('Drawing2');
  };

  // Handler for transitioning back from Drawing2 to Drawing1
  const backToDrawing1Handler = () => {
    setSelectedDrawing('Drawing1');
  };

  const handleMarkerClick = (marker) => {
    // Check if the current user is the owner of the pin
    if (marker.username === currentUsername) {
      // Logic to handle marker click for the owner of the pin
      // This could include setting state to show edit/delete options
      console.log("This is the user's own pin.");
      setSelectedMarker(marker);
      setShowForm(true); // Assuming you have a state to show form/modal for editing
    } else {
      // If the user is not the owner, maybe just show the pin details without edit/delete options
      console.log("This pin belongs to another user.");
      setSelectedMarker(marker);
      // Optionally, set state to show pin details without showing edit/delete options
    }
  };


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


  // Function to fetch pins, now with optional username parameter
const fetchPinsDiffUser = async (usernameParam) => {
  try {
    const usernameToFetch = usernameParam || username; // Use provided username or fall back to the current user
    console.log('Fetching pins for user:', usernameToFetch);
    const response = await fetch(`http://localhost:3000/api/pins?username=${usernameToFetch}`);
    if (response.ok) {
      let pins = await response.json();
      pins = pins.filter(pin => pin.position && pin.position.lat && pin.position.lng);

      // Fetch details for each pin and filter out those without a 'name'
      const pinsWithDetails = (await Promise.all(pins.map(async (pin) => {
        const details = await fetchPinDetails(pin._id);
        // Only include pins where 'details' has a 'name' property that is not empty
        if (details && details.name) {
          return { ...pin, details };
        }
        return null; // Return null for pins without a name in details
      }))).filter(pin => pin !== null); // Filter out the nulls

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

      console.log("formdata", formData)
  
      if (response.ok) {
        // Logic to update the local state with the new details of the pin
        const updatedMarkers = markers.map(marker =>
          marker._id === formData._id ? { ...marker, ...formData } : marker
        );
        setMarkers(updatedMarkers);
        setShowForm(false);
        setSelectedMarker(null);
        console.log("9uhverjuiegnwf")

      } else {
        console.error('Failed to update pin:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating pin:', error);
    }
  };

const handleFormSubmitSuccess = (updatedMarker) => {
  const newMarkers = markers.map((marker) => {
    if (marker._id === updatedMarker._id) {
      // Ensure you're accessing a 'details' property on an object that's defined in this scope
      return { ...marker, details: updatedMarker.details };
    }
    return marker;
  });
  setMarkers(newMarkers);
  // Assuming updatedMarker contains the updated details you want to select
  setSelectedMarker(updatedMarker); // Correct usage if updatedMarker is the correct object
  setShowForm(false);
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


  useEffect(() => {
    
    if (selectedUser) {
      console.log('Fetching pins for:', selectedUser.username); // Add this line
      fetchPinsDiffUser(selectedUser.username);
    }
  }, [selectedUser])

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

  const renderContent = () => {
  if (selectedDrawing === 'Drawing1' && selectedMarker) {
    return (
      <>
      <Drawing1
        name={selectedMarker.details.name}
        pinId={selectedMarker?._id}
        notes={selectedMarker.details.notes}
        mediaFiles={selectedMarker.details.mediaFiles}
        music={selectedMarker.details.music} // Assuming this is the song URI
        songDetails={{
          title: selectedMarker.details.songTitle, // These fields should match how you store them
          previewUrl: selectedMarker.details.songPreviewUrl,
          albumArtUrl: selectedMarker.details.songAlbumArtUrl,
        }}
        onViewMore={viewMoreHandler}
        onDelete={() => deleteMarker(selectedMarker._id)}
      />
      {isViewingOwnMap && (
        <button onClick={() => deleteMarker(selectedMarker._id)}>Delete PINNNNN</button>
      )}
    </>
    ); 
  } else if (selectedDrawing === 'Drawing2') {
    return (
      <Drawing2
        onBack={backToDrawing1Handler}
        name={selectedMarker.details.name}
        notes={selectedMarker.details.notes}
        mediaFiles={selectedMarker.details.mediaFiles}
        music={selectedMarker.details.music}
      />
    );
  } else {
    return (
      <Form 
      onSubmit={handleFormSubmit} 
      _id={selectedMarker._id}
      onDelete={() => deleteMarker(selectedMarker._id)} 
      initialName={selectedMarker.details?.name || ''} 
      initialNotes={selectedMarker.details?.notes || ''} 
      initialMusic={selectedMarker.details?.music || ''} 
      initialMediaFiles={selectedMarker.details?.mediaFiles || []}
      onSubmissionSuccess={() => handleFormSubmissionSuccess()}
      onFormSubmitSuccess={handleFormSubmitSuccess}
      
    />
    );
  }
};

  function LocationMarker() {

    const handleMapClick = async (newMarker) => {
      // Assuming your backend expects an object with position and name

      if (!selectedUser || selectedUser.username === currentUsername) {
        // Assuming your backend expects an object with position and name
        const markerWithUser = { ...newMarker, username: currentUsername, details: {} };
    
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
      } else {
        // Optionally, provide feedback to the user that they can't add pins on someone else's map
        console.log("You can't add pins while viewing another user's map.");
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

  // const handleSelectMarker = (marker) => {
  //   setSelectedMarker(marker);
  //   setShowForm(true);
  // }

  return (
    <div className="map">
      <MapContainer center={[53.411730, -2.982645]} zoom={13} style={{ height: '955px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker /> {/* Add LocationMarker here */}
        {markers.map((marker, idx) => (
          <Marker 
          key={idx} 
          position={marker.position} 
          icon={customIcon} 
          eventHandlers={{
            click: () => {
              if (isViewingOwnMap) {
                // If viewing own map, allow editing/deleting
                setSelectedMarker(marker);
                setShowForm(true);
                handleMarkerClick(marker); // This should handle the logic for showing editable details
              } else {
                // If viewing someone else's map, only show Drawing1
                setSelectedMarker(marker);
                setShowForm(true); // Show the form/modal that includes Drawing1
                setSelectedDrawing('Drawing1'); // Directly set to show Drawing1 without edit/delete options
              }
            }
          }}
        ></Marker>
      
        ))}
      </MapContainer>
      {showForm && selectedMarker && (
        <div className="modal-backdrop">
          <div className="form-modal">
            <button className="close-button" onClick={() => setShowForm(false)}>X</button>
            {/* Pass the marker details to the drawings forms */}
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
