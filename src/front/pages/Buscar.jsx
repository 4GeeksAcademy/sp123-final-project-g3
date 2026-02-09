import "../index.css";
import React, { useEffect, useState } from "react";

import { CARD_PRUEBA } from "../mocks/jobsMock";
import CartaBuscarTrabajo from "../components/CartaBuscarTrabajo";

export default function Buscar() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        //  Aquí irá el fetch real en el futuro
        setJobs(CARD_PRUEBA);
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="page-title mb-4">Buscar Postulaciones</h2>

            <div className="search-grid">
                {jobs.map((job) => (
                    <CartaBuscarTrabajo key={job.external_id} job={job} />
                ))}
            </div>
        </div>
    );
}
