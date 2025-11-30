import React, { useState } from "react";
import { Modal } from "react-bootstrap";


export default function EventInfo({ event }) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Botón abrir modal */}
      <button className="mf-neon-btn w-100 mt-2" onClick={handleOpen}>
        Ver detalles
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title> {event.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="custom-modal-body">
          <p><strong>Deporte:</strong> {event.sport}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Organizado por:</strong> {event.creator_name}</p>
          <p><strong>Participantes:</strong> {event.participants.length}/{event.max_participants}</p>

          <hr className="text-secondary" />

          <p className="fw-bold">Localización:</p>
          {/* <p>{event.latitude}, {event.longitude}</p> */}

          {/* Botón Google Maps */}
          <a
            href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mf-neon-btn w-100 mt-2 text-center"
          >
            Ver en Google Maps 📍
          </a>
        </Modal.Body>

        <Modal.Footer className="bg-dark border-0 d-flex justify-content-center">
          {/* Botón cerrar */}
          <button className="mf-neon-btn w-100" onClick={handleClose}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
