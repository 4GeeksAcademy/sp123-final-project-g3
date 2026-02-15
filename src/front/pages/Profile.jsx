import "../index.css";
import { useState } from "react";

export default function MyProfile() {
    const [cvFile, setCvFile] = useState(null);

    const handleFileChange = (event) => {
        setCvFile(event.target.files[0]);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-semibold mb-0">Personal Information</h4>
                        <button className="btn btn-primary btn-sm">Save changes</button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="john.doe@email.com"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="+1 600 123 456"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="https://linkedin.com/in/johndoe"
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Portfolio / Website</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="https://myportfolio.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-card mb-4">
                    <h4 className="fw-semibold mb-3">Curriculum Vitae</h4>

                    <div className="cv-box text-center">
                        <div className="mb-2 fs-1">📄</div>

                        {!cvFile ? (
                            <p className="text-muted mb-3">You have not uploaded your CV yet</p>
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

                        <button className="btn btn-outline-primary">Upload CV</button>
                    </div>
                </div>

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
            </div>
        </div>
    );
}
