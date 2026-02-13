import { useEffect, useMemo, useState } from "react";
import "../index.css";

const Postulacion = ({ isOpen, onClose, onCreate }) => {
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [form, setForm] = useState({
    posicion: "",
    empresa: "",
    ubicacion: "",
    salario: "",
    urlOferta: "",
    descripcion: "",
    requisitos: "",
    contacto: "",
    estado: "Por aplicar",
    prioridad: "Media",
    fechaAplicacion: todayISO,
    fechaLimite: "",
    proximaEntrevista: "",
    notas: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate?.(form);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("post-modal-overlay")) onClose?.();
  };

  return (
    <div className="post-modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="post-modal-card" role="dialog" aria-modal="true">
        <div className="post-modal-header">
          <h2 className="post-modal-title">Nueva Postulación</h2>
          <button type="button" className="post-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-modal-form">
          <div className="post-modal-grid">
            <div className="post-field">
              <label className="post-label">
                Posición <span className="post-required">*</span>
              </label>
              <input
                className="form-control"
                name="posicion"
                value={form.posicion}
                onChange={handleChange}
                placeholder="ej. Desarrollador Frontend"
                required
              />
            </div>

            <div className="post-field">
              <label className="post-label">
                Empresa <span className="post-required">*</span>
              </label>
              <input
                className="form-control"
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
                placeholder="ej. Tech Company Inc."
                required
              />
            </div>

            <div className="post-field">
              <label className="post-label">Ubicación</label>
              <input
                className="form-control"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="ej. Madrid, España (Remoto)"
              />
            </div>

            <div className="post-field">
              <label className="post-label">Salario</label>
              <input
                className="form-control"
                name="salario"
                value={form.salario}
                onChange={handleChange}
                placeholder="ej. €40,000 - €50,000"
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">URL de la oferta</label>
              <input
                className="form-control"
                name="urlOferta"
                value={form.urlOferta}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Descripción</label>
              <textarea
                className="form-control post-textarea"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Añade una breve descripción de la oferta de trabajo."
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Requisitos</label>
              <textarea
                className="form-control post-textarea"
                name="requisitos"
                value={form.requisitos}
                onChange={handleChange}
                placeholder="Añade los requisitos para la posición."
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Contacto</label>
              <input
                className="form-control"
                name="contacto"
                value={form.contacto}
                onChange={handleChange}
                placeholder="ej. recruiter@empresa.com o Juan Pérez"
              />
            </div>

            <div className="post-field">
              <label className="post-label">Estado</label>
              <select className="form-control" name="estado" value={form.estado} onChange={handleChange}>
                <option>Por aplicar</option>
                <option>Aplicado</option>
                <option>Entrevista</option>
                <option>Oferta</option>
                <option>Rechazado</option>
              </select>
            </div>

            <div className="post-field">
              <label className="post-label">Prioridad</label>
              <select className="form-control" name="prioridad" value={form.prioridad} onChange={handleChange}>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="post-field">
              <label className="post-label">Fecha de aplicación</label>
              <input
                type="date"
                className="form-control"
                name="fechaAplicacion"
                value={form.fechaAplicacion}
                onChange={handleChange}
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Fecha límite de aplicación</label>
              <input
                type="date"
                className="form-control"
                name="fechaLimite"
                value={form.fechaLimite}
                onChange={handleChange}
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Próxima entrevista</label>
              <input
                type="datetime-local"
                className="form-control"
                name="proximaEntrevista"
                value={form.proximaEntrevista}
                onChange={handleChange}
              />
            </div>

            <div className="post-field post-span-2">
              <label className="post-label">Notas</label>
              <textarea
                className="form-control post-textarea"
                name="notas"
                value={form.notas}
                onChange={handleChange}
                placeholder="Añade notas sobre la empresa, proceso de selección, impresiones, etc."
              />
            </div>
          </div>

          <div className="post-modal-footer">
            <button type="button" className="post-btn post-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="post-btn post-btn-primary">
              Crear postulación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Postulacion;