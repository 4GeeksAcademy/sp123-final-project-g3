import "../index.css";
import { useState } from "react";

export default function MiPerfil() {
    const [cvFile, setCvFile] = useState(null);

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-semibold mb-0">Información Personal</h4>
                        <button className="btn btn-primary btn-sm">Guardar cambios</button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="juan.perez@email.com"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="+34 600 123 456"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="https://linkedin.com/in/juanperez"
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Portfolio / Sitio Web</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="https://miportfolio.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-card mb-4">
                    <h4 className="fw-semibold mb-3">Currículum Vitae</h4>

                    <div className="cv-box text-center">
                        <div className="mb-2 fs-1">📄</div>

                        {!cvFile ? (
                            <p className="text-muted mb-3">No has subido tu CV aún</p>
                        ) : (
                            <p className="fw-medium mb-3">
                                Archivo seleccionado: {cvFile.name}
                            </p>
                        )}

                        <input
                            type="file"
                            className="form-control mb-3"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />

                        <button className="btn btn-outline-primary">Subir CV</button>
                    </div>
                </div>

                <div className="profile-card">
                    <h4 className="fw-semibold mb-3">Alertas de Ofertas</h4>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Ubicación</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Madrid, Barcelona"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Salario mínimo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="35.000€"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Tipo de contrato</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Remoto, Híbrido"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Palabras clave</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="React, Frontend"
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-100 mb-4">+ Crear Alerta</button>

                    <div className="alerta-item d-flex justify-content-between align-items-center">
                        <span> Activa · React · Remoto · Madrid</span>
                        <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash-fill"></i>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
