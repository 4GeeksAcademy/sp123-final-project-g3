import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { sports } from "../jsApiComponents/sports"

export const CreateActivityPopup = ({ show, handleClose, onActivityCreated, coordinates, loadActivity }) => {



  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    description: "",
    max_participants: "",
    date: "",

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    if (!coordinates) {
      setError("Debes seleccionar una ubicación en el mapa");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("JWT-STORAGE-KEY");


      const bodyWithCoords = {
        ...formData,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };


      const resp = await fetch(`${BASE_URL}api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyWithCoords),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error creando actividad");
      }

      const data = await resp.json();
      onActivityCreated(data);
      
      window.dispatchEvent(new Event("activities-updated"));

      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="bg-dark text-light bg_PopUp">
        <Modal.Title>Crear actividad deportiva</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light bg_PopUp">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
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
            <Form.Select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              required
            >
              {sports.map((s) => (<option key={s} value={s}>{s}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              onChange={handleChange}
              placeholder="Describe la actividad"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Máx. participantes</Form.Label>
            <Form.Control
              name="max_participants"
              type="number"
              min="1"
              onChange={handleChange}
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
            <div className="p-2 bg-secondary rounded">
              {coordinates
                ? `Lat: ${coordinates.latitude.toFixed(5)}, Lng: ${coordinates.longitude.toFixed(5)}`
                : "Haz clic en el mapa para marcar la ubicación"}
            </div>

          </Form.Group>


          {error && <p className="text-danger">{error}</p>}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" className="ms-2 btn_Map" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Crear"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
