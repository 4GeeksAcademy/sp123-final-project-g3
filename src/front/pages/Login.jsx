import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import mascota from "../imagenes/robot.png";
import mascotagif from "../imagenes/robotlogin.gif";
import logo from "../imagenes/logo.png";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState("");

    const validate = (name, value) => {
        let error = "";

        if (!value.trim()) {
            error = "Este campo es obligatorio";
        } else {
            if (name === "email" && !value.includes("@")) {
                error = "Correo electrónico no válido";
            }
            if (name === "password" && value.length < 6) {
                error = "Mínimo 6 caracteres";
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });

        setErrors({
            ...errors,
            [name]: validate(name, value),
        });

        setLoginError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        Object.keys(form).forEach((key) => {
            const error = validate(key, form[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Simulación de login correcto / incorrecto
            if (form.email === "admin@admin.com" && form.password === "123456") {
                navigate("/dashboard"); // cambia la ruta si quieres
            } else {
                setLoginError("Correo o contraseña incorrectos");
            }
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

                    <h1 className="fw-semibold ms-3">Inicio de Sesión</h1>
                    <p className="login-subtitle ms-3">
                        Inicia sesión para acceder a tu tablero de empleos
                    </p>

                    {loginError && <div className="alert alert-danger">{loginError}</div>}

                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="john.doe@gmail.com"
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="••••••••••••"
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <div className="alert alert-danger mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" />
                                <label className="form-check-label">Recuérdame</label>
                            </div>
                            <a href="#" className="fw-medium">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button className="btn btn-primary w-100 mb-3">
                            Iniciar sesión
                        </button>

                        <p className="text-center">
                            ¿No tienes cuenta todavía?{" "}
                            <Link to="/registro" className="fw-semibold">
                                Regístrate
                            </Link>
                        </p>

                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1" />
                            <span className="mx-3 text-muted">O inicia sesión con</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-primary flex-fill">
                                Facebook
                            </button>
                            <button className="btn btn-outline-primary flex-fill">
                                Google
                            </button>
                            <button className="btn btn-outline-primary flex-fill">
                                Apple
                            </button>
                        </div>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <img src={mascotagif} alt="login visual" className="login-image" />
                    <div className="d-flex gap-2 mt-3 justify-content-center login-indicators">
                        <div className="indicator active"></div>
                        <div className="indicator active"></div>
                        <div className="indicator"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
