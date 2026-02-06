import "../index.css";
import React, { useEffect, useState } from "react";

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

export default function Buscar() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        //  Aquí irá el fetch real en el futuro
        setJobs(CARD_PRUEBA);
    }, []);

    return (
        <div className="board-page">
            <h2 className="page-title mb-4">Buscar Postulaciones</h2>

            <div className="search-grid">
                {jobs.map((job) => (
                    <CartaBuscarTrabajo key={job.external_id} job={job} />
                ))}
            </div>
        </div>
    );
}
