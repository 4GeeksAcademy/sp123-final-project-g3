import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function EventInfo({ event }) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="dark" className="mt-2" onClick={handleOpen}>
        Ver detalles
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton className="bg-secondary text-light border-0">
          <Modal.Title>📌 {event.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark text-light">
          <p><strong>Deporte:</strong> {event.sport}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Organizado por:</strong> {event.creator_name}</p>
          <p><strong>Participantes:</strong> {event.participants.length}/{event.max_participants}</p>

          <hr className="text-secondary" />

          <p className="fw-bold">Localización:</p>
          <p>{event.latitude}, {event.longitude}</p>

          <Button
            variant="outline-success"
            className="mt-2"
            href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            target="_blank"
          >
            Ver en Google Maps 📍
          </Button>
        </Modal.Body>

        <Modal.Footer className="bg-dark border-0">
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
