import React, { useState, useEffect } from 'react';
import { user } from '../jsApiComponents/user';
import { useNavigate } from 'react-router-dom';
import EventInfo from './EventInfo';



export default function CreatedEvents() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await user();
      if (response.ok) {
        setCreatedEvents(response.data.created_by);
      } else if (response.status === 401) {
        alert("Tu sesión ha caducado!");
        return navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container py-4 text-light custom-container-bg">
      <h3 className="mb-3"><i className="fa-regular fa-clipboard"></i> Eventos creados por mí</h3>

      {createdEvents.length === 0 && <p>No has creado ningún evento todavía.</p>}

      {createdEvents.map(event => (
        <div key={event.id} className="card p-3 mb-3 bg-secondary text-light custom-bg shadow-sm custom-overflow">
          <h5><i className="fa-solid fa-magnifying-glass"></i> {event.title}</h5>
          <p><strong>Deporte:</strong> {event.sport}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Participantes:</strong> {event.participants.length}/{event.max_participants}</p>

          <a
            href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mf-neon-btn d-block mt-2 text-center"
          >
            Ver en Google Maps <i className="fa-solid fa-location-dot"></i>
          </a>

          <div className="mt-2">
            <EventInfo event={event} />
          </div>
        </div>
      ))}
    </div>
  );
}
