import { useEffect, useMemo, useState } from "react";
import "../index.css";

const Postulation = ({ isOpen, onClose, onCreate }) => {
    const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const [form, setForm] = useState({
        position: "",
        company: "",
        location: "",
        salary: "",
        offerUrl: "",
        description: "",
        requirements: "",
        contact: "",
        status: "To apply",
        priority: "Medium",
        applicationDate: todayISO,
        deadlineDate: "",
        nextInterview: "",
        notes: "",
    });

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
        };

        document.addEventListener("keydown", onKeyDown);

        // Bloqueas el fondo (perfecto). El scroll debe vivir en el modal.
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate?.(form);
    };

    const handleOverlayClick = (event) => {
        // Cierra solo si clickas el overlay (no el contenido)
        if (
            event.target.classList.contains("post-modal-overlay") ||
            event.target.classList.contains("modal-overlay--padded")
        ) {
            onClose?.();
        }
    };

    return (
        <div
            className="modal-overlay modal-overlay--padded modal-overlay--high post-modal-overlay"
            onMouseDown={handleOverlayClick}
            role="presentation"
        >
            <div
                className="modal-card modal-card--large post-modal-card"
                role="dialog"
                aria-modal="true"
                aria-label="New Postulation"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="modal-header modal-header--bordered post-modal-header">
                    <h2 className="modal-title modal-title--primary post-modal-title">
                        New Postulation
                    </h2>
                    <button
                        type="button"
                        className="modal-close modal-close--styled post-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal__form post-modal-form">
                    {/* ✅ Esta zona será la scrollable */}
                    <div className="modal-grid modal-grid--2col post-modal-grid">
                        <div className="post-field">
                            <label className="post-label">
                                Position <span className="post-required">*</span>
                            </label>
                            <input
                                className="form-control"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Developer"
                                required
                            />
                        </div>

                        <div className="post-field">
                            <label className="post-label">
                                Company <span className="post-required">*</span>
                            </label>
                            <input
                                className="form-control"
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                placeholder="e.g. Tech Company Inc."
                                required
                            />
                        </div>

                        <div className="post-field">
                            <label className="post-label">Location</label>
                            <input
                                className="form-control"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Madrid, Spain (Remote)"
                            />
                        </div>

                        <div className="post-field">
                            <label className="post-label">Salary</label>
                            <input
                                className="form-control"
                                name="salary"
                                value={form.salary}
                                onChange={handleChange}
                                placeholder="e.g. €40,000 - €50,000"
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Offer URL</label>
                            <input
                                className="form-control"
                                name="offerUrl"
                                value={form.offerUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Description</label>
                            <textarea
                                className="form-control post-textarea"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Add a brief description of the job offer."
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Requirements</label>
                            <textarea
                                className="form-control post-textarea"
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                                placeholder="Add the requirements for the position."
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Contact</label>
                            <input
                                className="form-control"
                                name="contact"
                                value={form.contact}
                                onChange={handleChange}
                                placeholder="e.g. recruiter@company.com or John Doe"
                            />
                        </div>

                        <div className="post-field">
                            <label className="post-label">Status</label>
                            <select
                                className="form-control"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option>To apply</option>
                                <option>Applied</option>
                                <option>Interview</option>
                                <option>Offer</option>
                                <option>Rejected</option>
                            </select>
                        </div>

                        <div className="post-field">
                            <label className="post-label">Priority</label>
                            <select
                                className="form-control"
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div className="post-field">
                            <label className="post-label">Application date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="applicationDate"
                                value={form.applicationDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Application deadline</label>
                            <input
                                type="date"
                                className="form-control"
                                name="deadlineDate"
                                value={form.deadlineDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Next interview</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="nextInterview"
                                value={form.nextInterview}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="post-field post-span-2">
                            <label className="post-label">Notes</label>
                            <textarea
                                className="form-control post-textarea"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Add notes about the company, selection process, impressions, etc."
                            />
                        </div>
                    </div>

                    {/* Footer fijo (no se pierde) */}
                    <div className="modal-footer modal-footer--bordered post-modal-footer">
                        <button
                            type="button"
                            className="modal-btn modal-btn--secondary post-btn post-btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="modal-btn modal-btn--primary post-btn post-btn-primary"
                        >
                            Create postulation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Postulation;
