import React, { useState, useEffect } from 'react'
import { user } from '../jsApiComponents/user'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import EventInfo from './EventInfo';

export default function JoinedEvents() {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [user_get, setUser_get] = useState(null);
  const navigate = useNavigate()

  const getUser = async () => {
    try {
      const response = await user()
      if (response.ok) {
        setJoinedEvents(response.data.joined)
        console.log(user_get)
      } else if (response.status == 401) {
        alert('Tu sesion ha caducado!')
        return navigate('/login')
      }

    } catch (error) {
      console.log("Error fetching user:", error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className="container py-4">
      {/* <Button onClick={() => console.log(user_get)} >ver eventos</Button> */}
      <h3 className="mb-3"> <i class="fa-solid fa-flag-checkered"></i> Eventos a los que me he unido</h3>


      {joinedEvents.length === 0 && (
        <p>No te has unido a ningún evento todavía.</p>
      )}


      {joinedEvents.map(event => (
        <div key={event.id} className="card p-3 mb-3 shadow-sm bg-secondary custom-overflow ">
          <h5><i class="fa-solid fa-magnifying-glass"></i> {event.title}</h5>
          <p><strong>Deporte:</strong> {event.sport}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Organizado por:</strong> {event.creator_name}</p>
          <p><strong>Participantes:</strong> {event.participants.length}/{event.max_participants}</p>
          <Button
            variant="success"
            href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            target="_blank"
          >
            Ver en Google Maps <i class="fa-solid fa-location-dot"></i>
          </Button>

        <br />
          <EventInfo event={event} />
        </div>
      ))}
    </div>
  )
}

