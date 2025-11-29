import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css";

// SVG
const IconAdmin = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`icon ${className}`}>
    <path fill="currentColor" d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" />
  </svg>
);

const IconGroup = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`icon ${className}`}>
    <path fill="currentColor" d="M40-160v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-200q-43 0-84-13.5T320-252v92H40Zm440-160q-38 0-72-17.5T351-386q-17-25-42.5-39.5T253-440q22-37 93-58.5T480-520q63 0 134 21.5t93 58.5q-29 0-55 14.5T609-386q-22 32-56 49t-73 17ZM160-440q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-560q0 50-34.5 85T160-440Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-560q0 50-34.5 85T800-440ZM480-560q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-680q0 50-34.5 85T480-560Z" />
  </svg>
);

const IconCalendar = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`icon ${className}`}>
    <path fill="currentColor" d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
  </svg>
);

const IconLocation = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`icon ${className}`}>
    <path fill="currentColor" d="M480-80q-106 0-173-33.5T240-200q0-24 14.5-44.5T295-280l63 59q-9 4-19.5 9T322-200q13 16 60 28t98 12q51 0 98.5-12t60.5-28q-7-8-18-13t-21-9l62-60q28 16 43 36.5t15 45.5q0 53-67 86.5T480-80Zm1-220q99-73 149-146.5T680-594q0-102-65-154t-135-52q-70 0-135 52t-65 154q0 67 49 139.5T481-300Zm-1 100Q339-304 269.5-402T200-594q0-71 25.5-124.5T291-808q40-36 90-54t99-18q49 0 99 18t90 54q40 36 65.5 89.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z" />
  </svg>
);

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const resp = await fetch(`${BASE_URL}/api/activities/${id}`);
        if (!resp.ok) throw new Error("No se pudo cargar el evento");
        const data = await resp.json();
        setEvent(data);
        setRating(data.rating || 0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  if (loading) return <p className="event-details loading">Cargando…</p>;
  if (error) return <p className="event-details error">{error}</p>;
  if (!event) return <p className="event-details error">Evento no encontrado</p>;

  const handleRate = async (value) => {
    setRating(value); // UI change
    try {
      const token = localStorage.getItem("JWT-STORAGE-KEY");
      const resp = await fetch(`${BASE_URL}/api/activities/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: value })
      });
      if (!resp.ok) throw new Error("No rating saved");
      const data = await resp.json();
      setRating(data.average_rating);
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };


  return (
    <div className="event-card-wrapper">
      <div className="event-card">

        <button
          className="add-btn"
          title="Add / Me gusta"
          onClick={() => console.log("¡Añadido!")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#817DF9">
            <path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" />
          </svg>
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>

        <h3 className="event-sport">{event.sport}</h3>
        <h1 className="event-title">{event.title || event.name}</h1>

        {event.image && <img src={event.image} alt={event.title} className="event-image" />}

        {/* Stars */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "filled" : ""}`}
              onClick={() => handleRate(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-number">{rating.toFixed(1)}</span>
        </div>


        <hr style={{ border: "1px solid #817DF9", margin: "20px 0" }} />

        <p className="event-description">{event.description}</p>

        <div className="event-info">
          <p><IconCalendar className="icon-info" /> <strong>Fecha y hora:</strong> {event.date ? new Date(event.date).toLocaleString() : "No especificado"}</p>

          {event.latitude != null && event.longitude != null && (
            <p><IconLocation className="icon-info" /> <strong>Ubicación:</strong> Lat: {event.latitude.toFixed(5)}, Lng: {event.longitude.toFixed(5)}</p>
          )}

          <p><IconGroup className="icon-info" /> <strong>Participantes:</strong> {(event.participants?.length ?? 0)}/{event.max_participants ?? 0}</p>

          {event.creator_name && (
            <p><IconAdmin className="icon-info" /> <strong>Creado por:</strong> {event.creator_name}</p>
          )}
        </div>

      </div>
    </div>
  );
};
