"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, } from "@react-google-maps/api";
import { Spinner, Container, Button } from "react-bootstrap";
import { CreateActivityPopup } from "../components/CreateActivityPopup";

export const MapView = () => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newMarker, setNewMarker] = useState(null);

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
        center={{ lat: 40.4168, lng: -3.7038 }}
        zoom={12}
        onClick={(e) => {
          setNewMarker({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          });
          setShowPopup(true);
        }}

      >
        {activities
        
        .filter(a => a.latitude && a.longitude) 
        .map((a) => (
          <Marker
            key={a.id}
            position={{ lat: a.latitude, lng: a.longitude }}
            onClick={() => setSelected(a)}
          />
        ))}
        {newMarker && (
          <Marker
            position={{ lat: newMarker.latitude, lng: newMarker.longitude }}
          />
        )}

        {selected && (
          <InfoWindow
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
        style={{ top: "10px", right: "10px", zIndex: 10, padding: "25px", fontSize: "20px" }}
        onClick={() => setShowPopup(true)}
      >
        Crear actividad deportiva
      </Button>

      <CreateActivityPopup
        show={showPopup}
        handleClose={() => setShowPopup(false)}
        coordinates={newMarker}
        onActivityCreated={(newActivity) =>
          setActivities((prev) => [...prev, newActivity])
        }
      />
    </div>

  );
};
