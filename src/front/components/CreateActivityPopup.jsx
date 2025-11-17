import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

export const CreateActivityPopup = ({ show, handleClose, onActivityCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error creando actividad");
      }

      const data = await resp.json();
      onActivityCreated(data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>Crear nueva actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de actividad</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ej: Running en el Retiro"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Control
              type="text"
              name="sport"
              placeholder="Ej: Running, Ciclismo, Yoga..."
              value={formData.sport}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Ej: Parque del Retiro, Madrid"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" className="ms-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Crear"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
