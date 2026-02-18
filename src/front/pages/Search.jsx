import "../index.css";
import React, { useEffect, useMemo, useState } from "react";
import { CARD_PRUEBA } from "../mocks/jobsMock";
import { useSavedOffers } from "../context/SavedOffers";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export default function Search() {
    // const [jobs, setJobs] = useState([]); // Removed local state
    const [query, setQuery] = useState("Developer");
    const [showAuthAlert, setShowAuthAlert] = useState(false);

    const { isSaved, toggleSave } = useSavedOffers();
    const { store, actions } = useGlobalReducer();
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
        // Call getJobs on mount as requested
        actions.getJobs(query);
    }, []);

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            // Remotive API in this exercise is static list, 
            // so we could implement local filtering here if needed.
            // For now, we just reload the jobs.
            actions.getJobs(query);
        }
    };

    const handleSave = async (job) => {
        if (!isAuthenticated) {
            showAuthFeedback();
            return;
        }

        const success = await actions.saveJob(job);
        if (success) {
            toggleSave({ ...job, external_id: job.id });
        }
    };

    // Filter locally if query exists, otherwise show all store.jobs
    const filteredJobs = store.jobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        (job.company_name && job.company_name.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <main className="dashboard-page">
            <section className="dashboard-container search-page">
                <header className="search-header">
                    <div>
                        <h2 className="page-title mb-1">Search Postulations</h2>
                        <p className="search-subtitle mb-0">Search filter</p>
                    </div>

                    <div className="search-search">
                        <button className="search-icon-btn" onClick={() => handleSearch({ key: 'Enter' })}>
                            <i className="bi bi-search search-search-icon" />
                        </button>
                        <input
                            className="form-control search-search-input"
                            placeholder="Search by position or company..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </header>

                <div className="search-results-bar">
                    Results: <strong>{filteredJobs.length}</strong>
                </div>

                <div className="search-list">
                    {filteredJobs.map((job) => {
                        const jobId = job.id;
                        const saved = isSaved(jobId);

                        return (
                            <article className="search-rowcard" key={jobId}>
                                <div className="search-rowcard-main">
                                    <div className="search-rowcard-top">
                                        <div>
                                            <h3 className="search-job-title">{job.title}</h3>
                                            <div className="search-job-meta">
                                                <span className="search-chip">
                                                    <i className="bi bi-building" /> {job.company_name || job.company}
                                                </span>
                                                <span className="search-chip">
                                                    <i className="bi bi-geo-alt" /> {job.location || "Remote"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn btn-sm ${saved ? "btn-success" : isAuthenticated ? "btn-outline-primary" : "btn-outline-secondary"
                                                } ${!isAuthenticated ? "btn-save-locked" : ""}`}
                                            onClick={() => handleSave(job)}
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

                                    {/* Remotive jobs sometimes only have URL, or html description. 
                                        We check for apply_url or render snippet */}
                                    <div className="mt-2">
                                        <a href={job.apply_url || job.url} target="_blank" rel="noopener noreferrer" className="btn-link text-decoration-none">
                                            Read more / Apply <i className="bi bi-box-arrow-up-right ms-1"></i>
                                        </a>
                                    </div>
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
