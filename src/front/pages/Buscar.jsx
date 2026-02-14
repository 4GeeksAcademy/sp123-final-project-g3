import "../index.css";
import React, { useEffect, useMemo, useState } from "react";
import { CARD_PRUEBA } from "../mocks/jobsMock";
import { useOfertasGuardadas } from "../context/OfertasGuardadas";

export default function Buscar() {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState("");

    const { estaGuardada, toggleGuardar } = useOfertasGuardadas();

    useEffect(() => {
        setJobs(CARD_PRUEBA);
    }, []);

    const filteredJobs = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return jobs;

        return jobs.filter((job) =>
            Object.values(job)
                .filter((v) => v !== null && v !== undefined)
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [jobs, query]);

    return (
        <main className="dashboard-page">
            <section className="dashboard-container buscar-page">
                <header className="buscar-header">
                    <div>
                        <h2 className="page-title mb-1">Buscar Postulaciones</h2>
                        <p className="buscar-subtitle mb-0">Filtro de búsqueda</p>
                    </div>

                    <div className="buscar-search">
                        <i className="bi bi-search buscar-search-icon" />
                        <input
                            className="form-control buscar-search-input"
                            placeholder="Buscar por puesto o empresa..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="buscar-results-bar">
                    Resultados: <strong>{filteredJobs.length}</strong>
                </div>

                <div className="buscar-list">
                    {filteredJobs.map((job) => {
                        const jobId = job.external_id ?? job.id;
                        const guardada = estaGuardada(jobId);

                        return (
                            <article className="buscar-rowcard" key={jobId}>
                                <div className="buscar-rowcard-main">
                                    <div className="buscar-rowcard-top">
                                        <div>
                                            <h3 className="buscar-job-title">{job.title}</h3>
                                            <div className="buscar-job-meta">
                                                <span className="buscar-chip">
                                                    <i className="bi bi-building" /> {job.company}
                                                </span>
                                                <span className="buscar-chip">
                                                    <i className="bi bi-geo-alt" /> {job.location}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn btn-sm ${guardada ? "btn-success" : "btn-outline-primary"
                                                }`}
                                            onClick={() => toggleGuardar({ ...job, external_id: jobId })}
                                            type="button"
                                        >
                                            {guardada ? (
                                                <>
                                                    <i className="bi bi-bookmark-check-fill me-1" />
                                                    Guardado
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-bookmark-plus me-1" />
                                                    Guardar
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {job.description && (
                                        <p className="buscar-rowcard-desc">
                                            {String(job.description).slice(0, 200)}
                                            {String(job.description).length > 200 ? "…" : ""}
                                        </p>
                                    )}
                                </div>
                            </article>
                        );
                    })}

                    {filteredJobs.length === 0 && (
                        <div className="buscar-empty">No hay resultados con ese filtro.</div>
                    )}
                </div>
            </section>
        </main>
    );
}
