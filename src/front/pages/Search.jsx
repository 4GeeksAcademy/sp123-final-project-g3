import "../index.css";
import React, { useEffect, useMemo, useState } from "react";
import { CARD_PRUEBA } from "../mocks/jobsMock";
import { useSavedOffers } from "../context/SavedOffers";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import searchIllustration from "../imagenes/search-illustration.png";

const FILTERS = ["All", "Development", "Design", "Data", "Product", "Marketing"];

// Secuencia: rojo → azul → amarillo → verde → ...
const ACCENT_SEQUENCE = [
    "#f39b1e",
    "#2e9ca0",
    "#533946",
    "#3c8f63",
    "#0f2c33",
    "#6d3c4f"

];

const getAccentColor = (index) => ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];

export default function Search() {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showAuthAlert, setShowAuthAlert] = useState(false);

    const { isSaved, toggleSave } = useSavedOffers();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const isAuthenticated = !!(store.token || localStorage.getItem("token"));

    useEffect(() => {
        setJobs(CARD_PRUEBA);
    }, []);

    useEffect(() => {
        if (!showAuthAlert) return;
        const t = setTimeout(() => setShowAuthAlert(false), 3000);
        return () => clearTimeout(t);
    }, [showAuthAlert]);

    const showAuthFeedback = () => setShowAuthAlert(true);
    const closeAuthAlert = () => setShowAuthAlert(false);

    const goToLogin = () => {
        closeAuthAlert();
        navigate("/login");
    };

    const goToRegister = () => {
        closeAuthAlert();
        navigate("/register");
    };

    const normalize = (v) => String(v ?? "").toLowerCase();

    const jobSkills = (job) => {
        const skills =
            job.skills ??
            job.aptitudes ??
            job.tags ??
            job.stack ??
            job.techs ??
            [];

        if (typeof skills === "string") {
            return skills.split(",").map((s) => s.trim()).filter(Boolean);
        }

        if (Array.isArray(skills)) {
            return skills
                .map((s) => (typeof s === "string" ? s : s?.name))
                .filter(Boolean);
        }

        return [];
    };

    const filteredJobs = useMemo(() => {
        const q = query.trim().toLowerCase();

        return jobs.filter((job) => {
            const title = normalize(job.title);
            const company = normalize(job.company);
            const skills = jobSkills(job).join(" ").toLowerCase();

            const matchesQuery = !q || `${title} ${company} ${skills}`.includes(q);

            if (activeFilter === "All") return matchesQuery;

            const category = normalize(job.category ?? job.area ?? job.type);
            return matchesQuery && category.includes(activeFilter.toLowerCase());
        });
    }, [jobs, query, activeFilter]);

    return (
        <main className="dashboard-page">
            <section className="dashboard-container search-page search-v2">
                <header className="sv2-hero">
                    <div className="sv2-hero-left">
                        <h2 className="sv2-title">Search Postulations</h2>
                        <p className="sv2-subtitle">
                            Discover new opportunities tailored to your profile
                        </p>

                        <div className="sv2-input">
                            <i className="bi bi-search sv2-input-icon" />
                            <input
                                className="form-control sv2-input-control"
                                placeholder="Search by position, company or skill..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="sv2-filters">
                            <span className="sv2-filters-label">Filter by:</span>
                            <div className="sv2-filters-pills">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        className={`sv2-pill ${activeFilter === f ? "is-active" : ""}`}
                                        onClick={() => setActiveFilter(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sv2-results">
                            Results: <strong>{filteredJobs.length}</strong>
                        </div>
                    </div>

                    <div className="sv2-hero-right" aria-hidden="true">
                        <img
                            src={searchIllustration}
                            alt=""
                            className="sv2-hero-img"
                            loading="lazy"
                        />
                    </div>
                </header>

                <div className="sv2-grid">
                    {filteredJobs.map((job, index) => {
                        const jobId = job.external_id ?? job.id;
                        const saved = isSaved(jobId);
                        const skills = jobSkills(job).slice(0, 6);

                        return (
                            <article
                                className="sv2-card"
                                key={jobId}
                                style={{ "--sv2-accent": getAccentColor(index) }}
                            >
                                <div className="sv2-card-top">
                                    <div className="sv2-card-titlewrap">
                                        <h3 className="sv2-card-title">{job.title}</h3>
                                        {job.company && (
                                            <p className="sv2-card-company">{job.company}</p>
                                        )}
                                    </div>

                                    <button
                                        className={`sv2-save btn btn-sm ${saved
                                            ? "btn-success"
                                            : isAuthenticated
                                                ? "btn-outline-primary"
                                                : "btn-outline-secondary"
                                            } ${!isAuthenticated ? "sv2-save-locked" : ""}`}
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                showAuthFeedback();
                                                return;
                                            }
                                            toggleSave({ ...job, external_id: jobId });
                                        }}
                                        type="button"
                                        title={
                                            isAuthenticated
                                                ? saved
                                                    ? "Offer saved"
                                                    : "Save offer"
                                                : "Log in to save offers"
                                        }
                                    >
                                        {saved ? (
                                            <>
                                                <i className="bi bi-bookmark-check-fill me-1" />
                                                Saved
                                            </>
                                        ) : (
                                            <>
                                                <i
                                                    className={`bi me-1 ${isAuthenticated ? "bi-bookmark-plus" : "bi-lock-fill"
                                                        }`}
                                                />
                                                {isAuthenticated ? "Save" : "Log in"}
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="sv2-skills">
                                    {skills.length ? (
                                        skills.map((s, idx) => (
                                            <span className="sv2-skill" key={`${jobId}-${idx}`}>
                                                {s}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="sv2-skill sv2-skill--muted">
                                            No skills listed
                                        </span>
                                    )}
                                </div>

                                <div className="sv2-footer">
                                    <span className="sv2-hint">
                                        {isAuthenticated
                                            ? "Open and track this offer in your board"
                                            : "Log in to see full details"}
                                    </span>
                                </div>
                            </article>
                        );
                    })}

                    {filteredJobs.length === 0 && (
                        <div className="sv2-empty">No results with that filter.</div>
                    )}
                </div>

                {showAuthAlert && (
                    <div
                        className="auth-alert-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) closeAuthAlert();
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
                            <p className="auth-alert-message">
                                You must log in to save offers
                            </p>
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
