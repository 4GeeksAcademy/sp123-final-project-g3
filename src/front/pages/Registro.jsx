import "../index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import robotgif from "../imagenes/robotregistrogif.gif";
import logo from "../imagenes/logo.png";

export default function Registro() {
    const [form, setForm] = useState({
        nombre: "",
        apellidos: "",
        usuario: "",
        email: "",
        telefono: "",
        password: "",
        fecha: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = (name, value) => {
        let error = "";

        switch (name) {
            case "nombre":
            case "apellidos":
            case "usuario":
                if (!value.trim()) error = "Este campo es obligatorio";
                break;

            case "email":
                if (!value.includes("@")) error = "Email no válido";
                break;

            case "telefono":
                if (!/^[0-9]{9}$/.test(value)) error = "Debe tener 9 dígitos";
                break;

            case "password":
                if (value.length < 6)
                    error = "La contraseña debe tener al menos 6 caracteres";
                break;

            case "fecha":
                if (!value) error = "Selecciona una fecha";
                break;

            default:
                break;
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

                    <h1 className="fw-semibold ms-3">Crea tu cuenta</h1>
                    <p className="login-subtitle ms-3">
                        Crea tu nueva cuenta para comenzar
                    </p>

                    {success && (
                        <div className="alert alert-success">
                            Registro completado correctamente
                        </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                                {errors.nombre && (
                                    <div className="alert alert-danger mt-1">{errors.nombre}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                                {errors.apellidos && (
                                    <div className="alert alert-danger mt-1">
                                        {errors.apellidos}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario</label>
                            <input
                                type="text"
                                name="usuario"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.usuario && (
                                <div className="alert alert-danger mt-1">{errors.usuario}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Número de teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.telefono && (
                                <div className="alert alert-danger mt-1">{errors.telefono}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Crear contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <div className="alert alert-danger mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="fecha"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.fecha && (
                                <div className="alert alert-danger mt-1">{errors.fecha}</div>
                            )}
                        </div>

                        <button className="btn btn-primary w-100 mb-3">
                            Crear cuenta
                        </button>

                        <p className="text-center">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/" className="fw-semibold">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <img src={robotgif} alt="register visual" className="login-image" />
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
