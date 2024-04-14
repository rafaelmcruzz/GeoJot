import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from './UserContext';
import L from 'leaflet';
import Form from './Form';
import Drawing1 from './Drawing1';
import Drawing2 from './Drawing2';
import markerIconPng from './Pin.png';
import 'leaflet/dist/leaflet.css';
import 'animate.css';

//Custom animated icon for pins
const animatedIcon = new L.DivIcon({
  html: `<div class="custom-icon animate__animated animate__bounce" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;"><img src="${markerIconPng}" style="width: 100%; height: auto;"/></div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -34]
});

//Main map component
function Map({ selectedUser, selectedPin }) {
 
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const { username } = useUser();
  const { username: currentUsername } = useUser();

  //Checks if user is viewing their own map
  const isViewingOwnMap = currentUsername === (selectedUser ? selectedUser.username : currentUsername);
  const canEdit = isViewingOwnMap ||(selectedMarker?.collaborators?.includes(username) ?? false);

  //Function to handle form successfull submission
  const handleFormSubmissionSuccess = () => {
    setShowForm(false);
    fetchPins();
  }

  // Handler for transitioning from Drawing1 to Drawing2
  const viewMoreHandler = () => {
    setSelectedDrawing('Drawing2');
  };

  // Handler for transitioning back from Drawing2 to Drawing1
  const backToDrawing1Handler = () => {
    setSelectedDrawing('Drawing1');
  };

  // Function to handle marker click
  const handleMarkerClick = async (marker) => {

    if (marker.username === currentUsername) {
      // Logic to handle marker click for the owner of the pin
      setSelectedMarker(marker);
      setShowForm(true);
    } else {
      // If the user is not the owner, just show the pin details without edit/delete options
      setSelectedMarker(marker);
    }
  };

  // Function to fetch pins to the current user
  const fetchPins = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pins?username=${username}`);
      if (response.ok) {
        let pins = await response.json();
        pins = pins.filter(pin => pin.position && pin.position.lat && pin.position.lng);
  
        const pinsWithDetails = await Promise.all(pins.map(async (pin) => {
          // Attempt to fetch details and use an empty object as fallback
          const details = await fetchPinDetails(pin._id) || {};
          return { ...pin, details };
        }));
  
        setMarkers(pinsWithDetails);
      } else {
        console.error('Failed to fetch pins:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  //Function to fetch pins, now for a different user
  const fetchPinsDiffUser = async (usernameParam) => {
    try {
      const usernameToFetch = usernameParam || username;
      const response = await fetch(`http://localhost:3000/api/pins?username=${usernameToFetch}`);
      if (response.ok) {
        let pins = await response.json();
        pins = pins.filter(pin => pin.position && pin.position.lat && pin.position.lng);

        //Fetch details for each pin and filter out those without a name
        const pinsWithDetails = (await Promise.all(pins.map(async (pin) => {
          const details = await fetchPinDetails(pin._id);
          //Only include pins where 'details' has a 'name' property that is not empty
          if (details && details.name) {
            return { ...pin, details };
          }
          return null; //Return null for pins without a name in details
        }))).filter(pin => pin !== null); //filter out the nulls

        setMarkers(pinsWithDetails);
      } else {
        console.error('Failed to fetch pins:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  
  //Fetches details for a pin
  const fetchPinDetails = async (pinId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pins/details/${pinId}`);
      if (response.ok) {
        const pinDetails = await response.json();
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
        //Logic to update the local state with the new details of the pin
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

  //Function to handle form submission success
  const handleFormSubmitSuccess = (updatedMarker) => {
    const newMarkers = markers.map((marker) => {
      if (marker._id === updatedMarker._id) {
        return { ...marker, details: updatedMarker.details };
      }
      return marker;
    });
    setMarkers(newMarkers);
    setSelectedMarker(updatedMarker);
    setShowForm(false);
  };

  //Zooms in on selected pin from recent pins
  function FlyToMarker() {
    const map = useMap(); // This hook is used here safely inside the MapContainer

    if (isViewingOwnMap) {

    useEffect(() => {
      if (selectedPin) {
        map.flyTo([selectedPin.position.lat, selectedPin.position.lng], 15); // Adjust zoom level as needed
      }
    }, [selectedPin, map]);

    }

    return null; // This component does not render anything
  }

  //Fetch pins when the component mounts
  useEffect(() => {
    if (username) {
      fetchPins(); //Only fetch pins if the username exists
    }
  }, [username]);

  // Determine which drawing component to display based on selectedMarker
  useEffect(() => {
    if (selectedMarker && selectedMarker.details && (selectedMarker.details.name || selectedMarker.details.notes)) {
      setSelectedDrawing('Drawing1');
    } else {
      setSelectedDrawing(null); // If no details, reset selectedDrawing
    }
  }, [selectedMarker]);

  // Fetch pins for a different user when selectedUser changes
  useEffect(() => {  
    if (selectedUser) {
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
        console.log('Pin successfully deleted');
        setMarkers(currentMarkers => currentMarkers.filter(marker => marker._id !== markerId));
        setSelectedMarker(null); // Reset selected marker after deletion
      } else {
        console.error('Failed to delete pin:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };


  // Function to render the content based on the selectedDrawing
  const renderContent = () => {
  if (selectedDrawing === 'Drawing1' && selectedMarker) {
    return (
      <>
      <Drawing1
        name={selectedMarker.details.name}
        pinId={selectedMarker?._id}
        notes={selectedMarker.details.notes}
        mediaFiles={selectedMarker.details.mediaFiles}
        music={selectedMarker.details.music}   
        songDetails={{
          title: selectedMarker.details.selectedSongDetails?.title,
          previewUrl: selectedMarker.details.selectedSongDetails?.previewUrl,
          albumArtUrl: selectedMarker.details.selectedSongDetails?.albumArtUrl,
          artists: selectedMarker.details.selectedSongDetails?.artists,
        }}
        onViewMore={viewMoreHandler}
        onDelete={() => deleteMarker(selectedMarker._id)}
        canEdit={canEdit}
        canInvite={isViewingOwnMap}
      />
      
    </>
    ); 
  } else if (selectedDrawing === 'Drawing2') {
    return (
      <Drawing2
        onBack={backToDrawing1Handler}
        name={selectedMarker.details.name}
        pinId={selectedMarker?._id}
        notes={selectedMarker.details.notes}
        mediaFiles={selectedMarker.details.mediaFiles}
        music={selectedMarker.details.music}
        songDetails={{
          title: selectedMarker.details.selectedSongDetails?.title,
          previewUrl: selectedMarker.details.selectedSongDetails?.previewUrl,
          albumArtUrl: selectedMarker.details.selectedSongDetails?.albumArtUrl,
          artists: selectedMarker.details.selectedSongDetails?.artists,
        }}
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

  // LocationMarker component for handling map events
  function LocationMarker() {

    const handleMapClick = async (newMarker) => {

      if (!selectedUser || selectedUser.username === currentUsername) {
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
            setMarkers((currentMarkers) => [...currentMarkers, { ...markerWithUser, _id: data._id }]);
            setSelectedMarker({ ...markerWithUser, _id: data._id });
            setShowForm(true);
          } else {
            console.error('Failed to save pin:', await response.text());
          }
        } catch (error) {
          console.error('Error creating pin:', error);
        }
      } else {
        console.log("You can't add pins while viewing another user's map.");
      }
  };

    useMapEvents({
      contextmenu(e) {
        const newMarker = {
          _id: uuidv4(),
          position: e.latlng,
          name: '',
          notes: '',
          music: '',
          media: null,
          username,
        };
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


  //Function to handle form submission success
  const handleFormSuccesss = () => {
    if (!selectedMarker.details?.name) {
      deleteMarker(selectedMarker._id);
    }
    setShowForm(false); 
  };

  
  {showForm && selectedMarker && (
    <div className="modal-backdrop">
      <div className="form-modal">
        <button className="close-button" onClick={() => setShowForm(false)}>X</button>
        <Form
          onSubmit={handleFormSubmit}
          _id={selectedMarker._id}
          onDelete={() => deleteMarker(selectedMarker._id)}
          initialName={selectedMarker.details?.name || ''}
          initialNotes={selectedMarker.details?.notes || ''}
          initialMusic={selectedMarker.details?.music || ''}
          initialMediaFiles={selectedMarker.details?.mediaFiles || []}
          onSubmissionSuccess={handleFormSuccesss} 
        />
      </div>
    </div>
  )}

  return (
    <div className="map">
      <MapContainer center={[53.411730, -2.982645]} zoom={13} style={{ height: '100vh' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToMarker />
        <LocationMarker />
        {markers.map((marker, idx) => (
          <Marker
          key={idx}
          position={marker.position}
          icon={animatedIcon}
          eventHandlers={{
            click: () => {
              if (isViewingOwnMap) {
                setSelectedMarker(marker);
                setShowForm(true);
                handleMarkerClick(marker);
              } else {
                setSelectedMarker(marker);
                setShowForm(true);
                setSelectedDrawing('Drawing1');
              }
            }
          }}
        ></Marker>
      
        ))}
      </MapContainer>
      {showForm && selectedMarker && (
        <div className="modal-backdrop">
          <div className="form-modal">
          <button className="close-button" onClick={() => {
            handleFormSuccesss();
            setShowForm(false);
          }}>X</button>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
