"use client";

import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, } from "@react-google-maps/api";
import { Spinner, Container, Button } from "react-bootstrap";
import { CreateActivityPopup } from "../components/CreateActivityPopup";
import ListOfActivities from "../components/ListOfActivities";

export const MapView = () => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newMarker, setNewMarker] = useState(null); 
  const [currentPosition, setCurrentPosition] = useState({ lat: 40.4168, lng: -3.7038 })
  const [filterSport, setFilterSport] = useState("all")
  const handleMarkerClick = (e) => {
    setShowPopup(true);
    setNewMarker({
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    });

  };

  console.log(activities)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const fetchActivities = async () => {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities`);
    const data = await resp.json();
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
  if (!selected) return;

  const timer = setTimeout(() => {
    const allInfoWindows = document.querySelectorAll('.gm-style-iw-c');
    allInfoWindows.forEach(win => {
      const textContent = win.innerText?.trim();
      const hasContent = textContent && textContent.length > 5;
      if (!hasContent) win.parentElement.style.display = "none";
    });
  }, 80);

  return () => clearTimeout(timer);
}, [selected]);

  if (!isLoaded)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );

  return (


    <div className="position-relative" style={{ height: "100vh", width: "100%" }}>
      

      <GoogleMap

        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={currentPosition}
        zoom={12}
        onClick={handleMarkerClick}

      >
        
        {activities

          .filter(a => a.latitude && a.longitude)
          .map((a) => (
            <Marker
              key={a.id}
              position={{ lat: a.latitude, lng: a.longitude }}
              onClick={(e) => {
                e.domEvent.preventDefault()
                e.domEvent.stopPropagation()
                setSelected(a)
                console.log
                
              }}
            />
          ))}
        {/* {newMarker && (
          <Marker
            position={{ lat: newMarker.latitude, lng: newMarker.longitude }}
            onClick={(e) => {
              e.domEvent.preventDefault()
              e.domEvent.stopPropagation()
              setCurrentPosition({lat: newMarker.latitude, lng: newMarker.longitude})
            }}
          />
        )} */}

        {selected && (
          <InfoWindow
            key={selected.name}
            options={{ zIndex: 10, }}
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h6>{selected.name}</h6>
              <p>{selected.sport}</p>
              <small>{new Date(selected.date).toLocaleString()}</small>
              <p className="text-muted">{selected.location}</p>
              <p><strong>Creado por:</strong> {selected.creator_name}</p>
            </div>
          </InfoWindow>
        )}
    
      </GoogleMap>

      {/* Botón flotante para crear actividad */}
      <Button
        variant="dark"
        className="position-absolute btn_Map"
        style={{ bottom: "900px", right: "60px", zIndex: 10, padding: "20px" }}
        onClick={() => setShowPopup(true)}
      >
        Crear actividad deportiva
      </Button>

      
    </div>

  );
};
