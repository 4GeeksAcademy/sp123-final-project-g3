import "../index.css";
import React, { useEffect, useMemo, useState } from "react";
import { CARD_PRUEBA } from "../mocks/jobsMock";
import { useSavedOffers } from "../context/SavedOffers";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState("");
    const [showAuthAlert, setShowAuthAlert] = useState(false);

    const { isSaved, toggleSave } = useSavedOffers();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const isAuthenticated = !!(store.token || localStorage.getItem("token"));

    useEffect(() => {
        if (showAuthAlert) {
            const timer = setTimeout(() => {
                setShowAuthAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAuthAlert]);

    const showAuthFeedback = () => {
        setShowAuthAlert(true);
    };

    const closeAuthAlert = () => {
        setShowAuthAlert(false);
    };

    const goToLogin = () => {
        closeAuthAlert();
        navigate("/login");
    };

    const goToRegister = () => {
        closeAuthAlert();
        navigate("/register");
    };

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
            <section className="dashboard-container search-page">
                <header className="search-header">
                    <div>
                        <h2 className="page-title mb-1">Search Postulations</h2>
                        <p className="search-subtitle mb-0">Search filter</p>
                    </div>

                    <div className="search-search">
                        <i className="bi bi-search search-search-icon" />
                        <input
                            className="form-control search-search-input"
                            placeholder="Search by position or company..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                </header>

                <div className="search-results-bar">
                    Results: <strong>{filteredJobs.length}</strong>
                </div>

                <div className="search-list">
                    {filteredJobs.map((job) => {
                        const jobId = job.external_id ?? job.id;
                        const saved = isSaved(jobId);

                        return (
                            <article className="search-rowcard" key={jobId}>
                                <div className="search-rowcard-main">
                                    <div className="search-rowcard-top">
                                        <div>
                                            <h3 className="search-job-title">{job.title}</h3>
                                            <div className="search-job-meta">
                                                <span className="search-chip">
                                                    <i className="bi bi-building" /> {job.company}
                                                </span>
                                                <span className="search-chip">
                                                    <i className="bi bi-geo-alt" /> {job.location}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn btn-sm ${saved ? "btn-success" : isAuthenticated ? "btn-outline-primary" : "btn-outline-secondary"
                                                } ${!isAuthenticated ? "btn-save-locked" : ""}`}
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    showAuthFeedback();
                                                    return;
                                                }
                                                toggleSave({ ...job, external_id: jobId });
                                            }}
                                            type="button"
                                            title={isAuthenticated ? (saved ? "Offer saved" : "Save offer") : "Log in to save offers"}
                                        >
                                            {saved ? (
                                                <>
                                                    <i className="bi bi-bookmark-check-fill me-1" />
                                                    Saved
                                                </>
                                            ) : (
                                                <>
                                                    <i className={`bi me-1 ${isAuthenticated ? 'bi-bookmark-plus' : 'bi-lock-fill'}`} />
                                                    {isAuthenticated ? 'Save' : 'Log in'}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {job.description && (
                                        <p className="search-rowcard-desc">
                                            {String(job.description).slice(0, 200)}
                                            {String(job.description).length > 200 ? "…" : ""}
                                        </p>
                                    )}
                                </div>
                            </article>
                        );
                    })}

                    {filteredJobs.length === 0 && (
                        <div className="search-empty">No results with that filter.</div>
                    )}
                </div>

                {showAuthAlert && (
                    <div
                        className="auth-alert-overlay"
                        onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                closeAuthAlert();
                            }
                        }}
                    >
                        <div className="auth-alert">
                            <button
                                className="auth-alert-close"
                                onClick={closeAuthAlert}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <i className="bi bi-lock-fill auth-alert-icon"></i>
                            <p className="auth-alert-message">You must log in to save offers</p>
                            <p className="auth-alert-subtitle">
                                Log in or create an account to continue
                            </p>
                            <div className="auth-alert-actions">
                                <button
                                    className="auth-alert-btn auth-alert-btn--primary"
                                    onClick={goToLogin}
                                >
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Log in
                                </button>
                                <button
                                    className="auth-alert-btn auth-alert-btn--secondary"
                                    onClick={goToRegister}
                                >
                                    <i className="bi bi-person-plus me-2"></i>
                                    Create account
                                </button>
                            </div>
                            <button
                                className="auth-alert-btn auth-alert-btn--link"
                                onClick={closeAuthAlert}
                            >
                                Later
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
