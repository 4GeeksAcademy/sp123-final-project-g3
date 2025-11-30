// "use client";

// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
// import { Spinner, Button } from "react-bootstrap";
// import { CreateActivityPopup } from "../components/CreateActivityPopup";
// import { user } from "../jsApiComponents/user";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export const MapView = () => {
//   const [activities, setActivities] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [newMarker, setNewMarker] = useState(null);
//   const [currentPosition, setCurrentPosition] = useState({ lat: 40.4168, lng: -3.7038 });
//   const [userLocation, setUserLocation] = useState(null);
//   const navigate = useNavigate();

//   const handleMarkerClick = (e) => {
//     setNewMarker({
//       latitude: e.latLng.lat(),
//       longitude: e.latLng.lng(),
//     });
//   };

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   const fetchActivities = async () => {
//     try {
//       const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities`);
//       const data = await resp.json();
//       setActivities(data);
//     } catch (error) {
//       toast.error("❌ Error cargando actividades");
//     }
//   };

//   const getUser = async () => {
//     try {
//       const response = await user();

//       if (response.ok) return; // 👍 Usuario correcto

//       if (response.status === 401) {
//         toast.warning("⚠️ Tu sesión ha caducado");
//         localStorage.removeItem("JWT-STORAGE-KEY");
//         return navigate("/login");
//       }

//     } catch (error) {
//       toast.error("❌ Error obteniendo datos de usuario");
//     }
//   };

//   useEffect(() => {
//     getUser();
//     fetchActivities();
//   }, []);

//   const handleGetUserLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("❌ Tu navegador no permite geolocalización");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const userPos = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setUserLocation(userPos);
//         setCurrentPosition(userPos);
//       },
//       () => {
//         toast.error("⚠️ No pudimos acceder a tu ubicación");
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   if (!isLoaded)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" variant="light" />
//       </div>
//     );

//   return (
//     <div className="row g-0 text-center w-100 m-0">

//       {/* 📌 FORMULARIO */}
//       <div className="col-12 col-xl-6 d-flex justify-content-center align-items-center p-0">
//         <div className="w-100 p-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
//           <CreateActivityPopup
//             show={true}
//             coordinates={newMarker}
//             onActivityCreated={fetchActivities}
//           />
//         </div>
//       </div>

//       {/* 🗺️ MAPA */}
//       <div className="col-12 col-xl-6 d-flex justify-content-center align-items-center p-3">
//         <GoogleMap
//           mapContainerStyle={{
//             width: "100%",
//             height: "70vh",
//             minHeight: "350px",
//             borderRadius: "20px",
//           }}
//           center={currentPosition}
//           zoom={12}
//           onClick={handleMarkerClick}
//           options={{ disableDefaultUI: true }}
//         >
//           {activities
//             .filter((a) => a.latitude && a.longitude)
//             .map((a) => (
//               <Marker
//                 key={a.id}
//                 position={{ lat: a.latitude, lng: a.longitude }}
//                 onClick={(e) => {
//                   e.domEvent.preventDefault();
//                   e.domEvent.stopPropagation();
//                   setSelected(a);
//                 }}
//               />
//             ))}

//           {newMarker && (
//             <Marker
//               position={{ lat: newMarker.latitude, lng: newMarker.longitude }}
//               onClick={() =>
//                 setCurrentPosition({
//                   lat: newMarker.latitude,
//                   lng: newMarker.longitude,
//                 })
//               }
//             />
//           )}

//           {userLocation && (
//             <Marker
//               position={userLocation}
//               icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
//             />
//           )}

//           <Button
//             variant="primary"
//             className="position-absolute"
//             style={{ top: "10px", right: "60px", zIndex: 10 }}
//             onClick={handleGetUserLocation}
//           >
//             📍 Mi ubicación
//           </Button>

//           {selected && (
//             <InfoWindow
//               key={selected.name}
//               options={{ zIndex: 10 }}
//               position={{ lat: selected.latitude, lng: selected.longitude }}
//               onCloseClick={() => setSelected(null)}
//             >
//               <div>
//                 <h6>{selected.name}</h6>
//                 <p>{selected.sport}</p>
//                 <small>{new Date(selected.date).toLocaleString()}</small>
//                 <p className="text-muted">{selected.location}</p>
//                 <p><strong>Título:</strong> {selected.title}</p>
//                 <p><strong>Creado por:</strong> {selected.creator_name}</p>
//                 <p><strong>Descripción:</strong> {selected.description}</p>
//                 <p><strong>Participantes:</strong> {selected.participants}</p>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Spinner, Button } from "react-bootstrap";
import { CreateActivityPopup } from "../components/CreateActivityPopup";
import { user } from "../jsApiComponents/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const MapView = () => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ lat: 40.4168, lng: -3.7038 });
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();


  const [showWelcomeTip, setShowWelcomeTip] = useState(true);
  const [showGeneralFormTip, setShowGeneralFormTip] = useState(false);
  const [showMapTip, setShowMapTip] = useState(false);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcomeTip(false);
      setShowGeneralFormTip(true);
    }, 3000);

    const formTimer = setTimeout(() => {
      setShowGeneralFormTip(false);
      setShowMapTip(true);
    }, 5000);

    const mapTimer = setTimeout(() => {
      setShowMapTip(false);
    }, 10000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(formTimer);
      clearTimeout(mapTimer);
    };
  }, []);


  const handleMarkerClick = (e) => {
    setNewMarker({
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const fetchActivities = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities`);
      const data = await resp.json();
      setActivities(data);
    } catch (error) {
      toast.error("❌ Error cargando actividades");
    }
  };

  const getUser = async () => {
    try {
      const response = await user();

      if (response.ok) return; // 👍 Usuario correcto

      if (response.status === 401) {
        toast.warning("⚠️ Tu sesión ha caducado");
        localStorage.removeItem("JWT-STORAGE-KEY");
        return navigate("/login");
      }

    } catch (error) {
      toast.error("❌ Error obteniendo datos de usuario");
    }
  };

  useEffect(() => {
    getUser();
    fetchActivities();
  }, []);

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("❌ Tu navegador no permite geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(userPos);
        setCurrentPosition(userPos);
      },
      () => {
        toast.error("⚠️ No pudimos acceder a tu ubicación");
      },
      { enableHighAccuracy: true }
    );
  };

  if (!isLoaded)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );

  return (
    <>
      <div className="row g-0 text-center w-100 m-0">

        {showWelcomeTip && (
          <div className="tip-bubble welcome-tip" style={{ top: "20px", left: "20px", zIndex: 9999 }}>
            ¡Hola! Aquí podrás crear tus eventos deportivos.
          </div>
        )}

        {showGeneralFormTip && (
          <div className="tip-bubble form-tip" style={{ top: "100px", left: "40px", zIndex: 9999 }}>
            Haz clic en el mapa para establecer la ubicación del encuentro y luego completa el formulario.
          </div>
        )}


        {/* 📌 FORMULARIO */}
        <div className="col-12 col-xl-6 d-flex justify-content-center align-items-center p-0 mt-5">
          <div className="w-100 p-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <CreateActivityPopup
              show={true}
              coordinates={newMarker}
              onActivityCreated={fetchActivities}
            />
          </div>
        </div>


        {/* 🗺️ MAPA */}
        <div className="col-12 col-xl-6 d-flex justify-content-center align-items-center p-3 mt-5">

          {showMapTip && (
            <div className="tip-bubble map-tip" style={{ top: "100px", right: "650px", zIndex: 9999 }}>
              Mueve el mapa. Desplázate libremente y encuentra el lugar ideal para tu evento.
            </div>
          )}

          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
              minHeight: "100%",
               
              marginRight: "70px",
              borderRadius: "20px",
              border: "2px solid #EE6C4D",
              borderTop: "6px solid #E3FE18",
              boxShadow: "0 5px 15px #817DF9",
            }}
            center={currentPosition}
            zoom={12}
            onClick={handleMarkerClick}
            options={{ disableDefaultUI: true }}
          >
            {activities
              .filter((a) => a.latitude && a.longitude)
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
                onClick={() =>
                  setCurrentPosition({
                    lat: newMarker.latitude,
                    lng: newMarker.longitude,
                  })
                }
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
              style={{ top: "40px", right: "40px", zIndex: 10 }}
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
        </div>


        <hr style={{ border: "1.5px solid #817DF9", margin: "40px 0" }} />


        <div
          className="container mt-5 mb-5 actividades-box"
        >
          <h3 className="text-center fw-bold mb-3 actividades-title">
            Actividades a las que quizá quieras unirte
          </h3>

          <div className="event-scroll-wrapper">
            <div className="event-scroll-container">
              {activities.length === 0 ? (
                <div className="text-muted">No hay actividades todavía.</div>
              ) : (
                activities.slice(0, 10).map((ev) => (
                  <div key={ev.id} className="event-card-scroll">
                    <h5>{ev.title}</h5>
                    <p className="text-muted">{ev.sport}</p>
                    <p style={{ fontSize: "0.9rem" }}>
                      {ev.description?.slice(0, 60)}...
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-center mt-3">
            <a
              href="/eventos"
              className="px-4 py-2 neon-button"
            >
              Ver todos los eventos →
            </a>
          </div>

        </div>

      </div>
    </>
  );
};