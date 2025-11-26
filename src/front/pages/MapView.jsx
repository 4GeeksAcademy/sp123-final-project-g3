"use client";

import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, } from "@react-google-maps/api";
import { Spinner, Container, Button } from "react-bootstrap";
import { CreateActivityPopup } from "../components/CreateActivityPopup";
import { Eventos } from "../components/Eventos";

export const MapView = () => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ lat: 40.4168, lng: -3.7038 })
  const [filterSport, setFilterSport] = useState("all")
  const [userLocation, setUserLocation] = useState(null);

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

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no permite geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Precisión:", pos.coords.accuracy, "metros");

        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserLocation(userPos);
        setCurrentPosition(userPos);
      },
      (err) => {
        console.warn("Error en geolocalización:", err);


        navigator.geolocation.watchPosition(
          (pos) => {
            console.log("Precisión (fallback):", pos.coords.accuracy, "metros");

            const userPos = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            setUserLocation(userPos);
            setCurrentPosition(userPos);
          },
          () => alert("No se pudo acceder a tu ubicación. Habilítala en el navegador."),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };




  if (!isLoaded)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );


  return (
  <div className="row text-center  gx-3 gy-4">

    <div
      className="col-12 col-lg-6 position-relative"
      style={{ height: "80vh", overflowY: "auto" }}
    >
      <Eventos />
    </div>

    <div
      className="col-12 col-lg-6 position-relative"
      style={{ height: "80vh" }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={currentPosition}
        zoom={12}
        onClick={handleMarkerClick}
        options={{disableDefaultUI: true}}
      >
        {activities
          .filter(a => a.latitude && a.longitude)
          .map((a) => (
            <Marker
              key={a.id}
              position={{ lat: a.latitude, lng: a.longitude }}
              onClick={(e) => {
                e.domEvent.preventDefault();
                e.domEvent.stopPropagation();
                setSelected(a);
              }}
            />
          ))}

        {newMarker && (
          <Marker
            position={{ lat: newMarker.latitude, lng: newMarker.longitude }}
            onClick={(e) => {
              e.domEvent.preventDefault();
              e.domEvent.stopPropagation();
              setCurrentPosition({
                lat: newMarker.latitude,
                lng: newMarker.longitude
              });
            }}
          />
        )}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
          />
        )}

        <Button
          variant="primary"
          className="position-absolute"
          style={{ top: "10px", right: "60px", zIndex: 10 }}
          onClick={handleGetUserLocation}
        >
          📍 Mi ubicación
        </Button>

        {selected && (
          <InfoWindow
            key={selected.name}
            options={{ zIndex: 10 }}
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h6>{selected.name}</h6>
              <p>{selected.sport}</p>
              <small>{new Date(selected.date).toLocaleString()}</small>
              <p className="text-muted">{selected.location}</p>
              <p><strong>Título:</strong> {selected.title}</p>
              <p><strong>Creado por:</strong> {selected.creator_name}</p>
              <p><strong>Descripción:</strong> {selected.description}</p>
              <p><strong>Participantes:</strong> {selected.participants}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Botón flotante para crear actividad */}
      <Button
        variant="dark"
        className="position-absolute btn_Map"
        style={{ bottom: "20px", right: "70px", zIndex: 10, padding: "20px" }}
        onClick={() => setShowPopup(true)}
      >
        Crear actividad deportiva
      </Button>

      {showPopup && (
        <CreateActivityPopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          coordinates={newMarker}
          onActivityCreated={() => {
            fetchActivities();
            setShowPopup(false);
          }}
        />
      )}
    </div>

  </div>
)
}