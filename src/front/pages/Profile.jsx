import "../index.css";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function MyProfile() {
    const { store, dispatch } = useGlobalReducer();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [cvFile, setCvFile] = useState(null);
    const [isUploadingCV, setIsUploadingCV] = useState(false);
    const [userCVs, setUserCVs] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedCV, setSelectedCV] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin_url: "",
        portfolio_url: "",
        profesional_title: ""
    });

    // Load user data on mount
    useEffect(() => {
        const loadUserData = async () => {
            const user = store.user || JSON.parse(localStorage.getItem("user") || "{}");
            const token = store.token || localStorage.getItem("token");

            if (!user.id || !token) {
                setMessage({ type: "error", text: "No se encontró información de usuario" });
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const userData = data.results;

                    setFormData({
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        linkedin_url: userData.linkedin_url || "",
                        portfolio_url: userData.portfolio_url || "",
                        profesional_title: userData.profesional_title || ""
                    });

                    // Update store with fresh data
                    dispatch({
                        type: "update_user",
                        payload: userData
                    });
                } else {
                    setMessage({ type: "error", text: "Error cargando datos del perfil" });
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                setMessage({ type: "error", text: "Error de conexión al cargar perfil" });
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
        loadUserCVs();
    }, [store.user?.id]);

    // Load user's CVs
    const loadUserCVs = async () => {
        const user = store.user || JSON.parse(localStorage.getItem("user") || "{}");
        const token = store.token || localStorage.getItem("token");

        if (!user.id || !token) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}/cvs`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUserCVs(data.results || []);
            }
        } catch (error) {
            console.error("Error loading CVs:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        const user = store.user || JSON.parse(localStorage.getItem("user") || "{}");
        const token = store.token || localStorage.getItem("token");

        if (!user.id || !token) {
            setMessage({ type: "error", text: "No hay sesión activa" });
            return;
        }

        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        linkedin_url: formData.linkedin_url,
                        portfolio_url: formData.portfolio_url,
                        profesional_title: formData.profesional_title
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "update_user",
                    payload: data.results
                });
                setMessage({ type: "success", text: "Perfil actualizado exitosamente" });
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.message || "Error al guardar cambios" });
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage({ type: "error", text: "Error de conexión al guardar" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validar tamaño (máx 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setMessage({ type: "error", text: "El archivo es demasiado grande (máx 10MB)" });
                return;
            }
            // Validar tipo
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: "error", text: "Solo se permiten archivos PDF, DOC o DOCX" });
                return;
            }
            setCvFile(file);
        }
    };

    const handleUploadCV = async () => {
        if (!cvFile) {
            setMessage({ type: "error", text: "Selecciona un archivo primero" });
            return;
        }

        const token = store.token || localStorage.getItem("token");

        if (!token) {
            setMessage({ type: "error", text: "No hay sesión activa" });
            return;
        }

        setIsUploadingCV(true);
        setMessage({ type: "", text: "" });

        try {
            // Convertir archivo a base64
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(cvFile);
            });

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/cv/upload`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        file_base64: base64,
                        filename: cvFile.name
                    })
                }
            );

            if (response.ok) {
                setCvFile(null);
                setMessage({ type: "success", text: "CV subido exitosamente" });
                loadUserCVs(); // Recargar lista de CVs
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.message || "Error al subir CV" });
            }
        } catch (error) {
            console.error("Error uploading CV:", error);
            setMessage({ type: "error", text: "Error de conexión al subir CV" });
        } finally {
            setIsUploadingCV(false);
        }
    };

    const handleDeleteCV = async (cvId) => {
        const token = store.token || localStorage.getItem("token");

        if (!token) return;

        if (!confirm("¿Estás seguro de eliminar este CV?")) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/cv/${cvId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                setMessage({ type: "success", text: "CV eliminado" });
                loadUserCVs();
            } else {
                setMessage({ type: "error", text: "Error al eliminar CV" });
            }
        } catch (error) {
            console.error("Error deleting CV:", error);
            setMessage({ type: "error", text: "Error de conexión" });
        }
    };

    const handleOpenPreview = (cv) => {
        setSelectedCV(cv);
        setShowPreviewModal(true);
    };

    const handleClosePreview = () => {
        setShowPreviewModal(false);
        setSelectedCV(null);
    };

    if (isLoading) {
        return (
            <div className="profile-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                {/* Mensajes de éxito/error */}
                {message.text && (
                    <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`} role="alert">
                        {message.text}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setMessage({ type: "", text: "" })}
                        ></button>
                    </div>
                )}

                {/* Personal Information */}
                <div className="profile-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-semibold mb-0">Personal Information</h4>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="john.doe@email.com"
                                value={formData.email}
                                disabled
                            />
                            <small className="text-muted">El email no se puede modificar</small>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="+1 600 123 456"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="text"
                                name="linkedin_url"
                                className="form-control"
                                placeholder="https://linkedin.com/in/johndoe"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Portfolio / Website</label>
                            <input
                                type="text"
                                name="portfolio_url"
                                className="form-control"
                                placeholder="https://myportfolio.com"
                                value={formData.portfolio_url}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Professional Title</label>
                            <input
                                type="text"
                                name="profesional_title"
                                className="form-control"
                                placeholder="Senior Frontend Developer"
                                value={formData.profesional_title}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Curriculum Vitae */}
                <div className="profile-card mb-4">
                    <h4 className="fw-semibold mb-3">Curriculum Vitae</h4>

                    {/* Lista de CVs existentes */}
                    {userCVs.length > 0 && (
                        <div className="mb-4">
                            <h6 className="mb-3">Your uploaded CVs:</h6>
                            <div className="list-group">
                                {userCVs.map((cv) => (
                                    <div key={cv.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-file-earmark-pdf me-2"></i>
                                            CV #{cv.id}
                                            <small className="text-muted ms-2">
                                                ({new Date(cv.created_at).toLocaleDateString()})
                                            </small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => handleOpenPreview(cv)}
                                                title="Ver CV"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteCV(cv.id)}
                                                title="Eliminar CV"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="cv-box text-center">
                        <div className="mb-2 fs-1">📄</div>

                        {!cvFile ? (
                            <p className="text-muted mb-3">You have not selected a file yet</p>
                        ) : (
                            <p className="fw-medium mb-3">
                                Selected file: {cvFile.name}
                            </p>
                        )}

                        <input
                            type="file"
                            className="form-control mb-3"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />

                        <button
                            className="btn btn-outline-primary"
                            onClick={handleUploadCV}
                            disabled={!cvFile || isUploadingCV}
                        >
                            {isUploadingCV ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Uploading...
                                </>
                            ) : (
                                "Upload CV"
                            )}
                        </button>
                    </div>
                </div>

                {/* Job Alerts */}
                <div className="profile-card">
                    <h4 className="fw-semibold mb-3">Job Alerts</h4>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="New York, Boston"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Minimum salary</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="$35,000"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Contract type</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Remote, Hybrid"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Keywords</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="React, Frontend"
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-100 mb-4">+ Create Alert</button>

                    <div className="alert-item d-flex justify-content-between align-items-center">
                        <span> Active · React · Remote · New York</span>
                        <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Modal de Vista Previa del CV */}
                {showPreviewModal && selectedCV && (
                    <div
                        className="modal show d-block"
                        style={{
                            background: 'rgba(0,0,0,0.8)',
                            zIndex: 9999
                        }}
                        onClick={handleClosePreview}
                    >
                        <div
                            className="modal-dialog modal-xl modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content" style={{ maxHeight: '90vh' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="bi bi-file-earmark-pdf me-2"></i>
                                        Vista previa del CV #{selectedCV.id}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleClosePreview}
                                    ></button>
                                </div>
                                <div className="modal-body p-0" style={{ height: '70vh' }}>
                                    <embed
                                        src={selectedCV.cv_url}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 'none' }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <a
                                        href={selectedCV.cv_url}
                                        download={`CV_${selectedCV.id}.pdf`}
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Descargar
                                    </a>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleClosePreview}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
