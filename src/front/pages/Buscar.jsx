import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Buscar = () => {
  return (
    <div className="search-page">
      <div className="search-card">
        <h1 className="search-title">Buscar Postulaciones</h1>

        <div className="search-empty">
          <div className="search-icon-wrap" aria-hidden="true">
            <i className="bi bi-search"></i>
          </div>

          <p className="search-subtitle">
            Próximamente: <span>Búsqueda de nuevas ofertas de empleo</span>
          </p>
          <p className="search-hint">Esta funcionalidad estará disponible pronto</p>
        </div>
      </div>
    </div>
  );
}

export default Buscar



