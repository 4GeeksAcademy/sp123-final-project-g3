import "../index.css";
import React, { useEffect, useState } from "react";

// Sustituir con datos reales en el futuro

const CARD_PRUEBA = [
    {
        external_id: "12345",
        title: "Senior React Developer",
        company: "Tech Corp",
        location: "Worldwide",
        salary: "$80k - $100k",
        logo: null,
        link: "https://example.com/job/react",
        source: "Remotive",
        date: "2023-10-05",
    },
    {
        external_id: "67890",
        title: "Frontend Engineer",
        company: "Startup Labs",
        location: "Remote - Europe",
        salary: "€60k - €75k",
        logo: null,
        link: "https://example.com/job/frontend",
        source: "Indeed",
        date: "2023-10-03",
    },
];

//CARD DE CADA OFERTA DE EMPLEO

function CartaBuscarTrabajo({ job }) {
    return (
        <div className="job-card search-card">
            <div className="job-card-row">
                <h4 className="job-title">{job.title}</h4>
                <span className="priority-badge priority-medium">
                    {job.source}
                </span>
            </div>

            <div className="job-meta">
                <span className="job-meta-item">
                    🏢 {job.company}
                </span>
                <span className="job-meta-item">
                    📍 {job.location}
                </span>
            </div>

            <div className="job-meta mt-1">
                <span className="job-meta-item">
                    💰 {job.salary}
                </span>
                <span className="job-meta-item">
                    📅 {job.date}
                </span>
            </div>

            <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-3 text-center"
            >
                Ver oferta
            </a>
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
