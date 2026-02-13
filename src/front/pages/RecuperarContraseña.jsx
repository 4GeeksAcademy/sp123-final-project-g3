import "../index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import robotgif from "../imagenes/robotregistrogif.gif";
import logo from "../imagenes/logo.png";

export default function RecuperarContraseña() {
    const [form, setForm] = useState({ email: "" });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = (name, value) => {
        if (name === "email") {
            if (!value.trim()) return "Este campo es obligatorio";
            if (!value.includes("@")) return "Email no válido";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
        setSuccess(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailError = validate("email", form.email);
        const newErrors = emailError ? { email: emailError } : {};

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setSuccess(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-form">
                    <div className="login-logo-form d-flex align-items-center mb-3">
                        <div className="logo-shape-1"></div>
                        <div className="logo-shape-2"></div>
                        <img src={logo} alt="logo" className="logo-image" />
                        <h3 className="fw-bold ms-2">¡Futuro nombre superchulo!</h3>
                    </div>

                    <h1 className="fw-semibold ms-3">Recuperar contraseña</h1>
                    <p className="login-subtitle ms-3">
                        Te enviaremos un enlace para restablecer tu contraseña
                    </p>

                    {success && (
                        <div className="alert alert-success">
                            Si el correo existe, recibirás instrucciones para recuperar tu contraseña.
                        </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">{errors.email}</div>
                            )}
                        </div>

                        <button className="btn btn-primary w-100 mb-3">
                            Enviar enlace
                        </button>

                        <p className="text-center mb-0">
                            ¿Te acordaste?{" "}
                            <Link to="/" className="fw-semibold">
                                Volver a iniciar sesión
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <img src={robotgif} alt="recover visual" className="login-image" />
                    <div className="d-flex gap-2 mt-3 justify-content-center login-indicators">
                        <div className="indicator active"></div>
                        <div className="indicator"></div>
                        <div className="indicator"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
