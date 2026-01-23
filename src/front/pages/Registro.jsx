import "../index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
// import mascotaregistro from "../imagenes/roboregistro.png";
import robotgif from "../imagenes/robotregistrogif.gif";

export default function Registro() {
    const [form, setForm] = useState({
        nombre: "",
        apellidos: "",
        usuario: "",
        email: "",
        telefono: "",
        direccion: "",
        fecha: ""
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = (name, value) => {
        let error = "";

        switch (name) {
            case "nombre":
            case "apellidos":
            case "usuario":
            case "direccion":
                if (!value.trim()) error = "Este campo es obligatorio";
                break;

            case "email":
                if (!value.includes("@")) error = "Email no válido";
                break;

            case "telefono":
                if (!/^[0-9]{9}$/.test(value))
                    error = "Debe tener 9 dígitos";
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
            [name]: validate(name, value)
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

                {/* Formulario */}
                <div className="login-form">

                    {/* Logo */}
                    <div className="login-logo-form mx-auto mb-3">
                        <div className="logo-shape-1"></div>
                        <div className="logo-shape-2"></div>
                        <h3 className="fw-bold ms-2">Logo Futuro</h3>
                    </div>

                    <h1 className="fw-semibold text-center">Crea tu cuenta</h1>
                    <p className="login-subtitle text-center">
                        Crea tu nueva cuenta para comenzar
                    </p>

                    {success && (
                        <div className="alert alert-success">
                            Registro completado correctamente ✅
                        </div>
                    )}

                    <form className="mt-4" onSubmit={handleSubmit}>

                        {/* Nombre / Apellidos */}
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
                                    <div className="alert alert-danger mt-1">
                                        {errors.nombre}
                                    </div>
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

                        {/* Usuario */}
                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario</label>
                            <input
                                type="text"
                                name="usuario"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.usuario && (
                                <div className="alert alert-danger mt-1">
                                    {errors.usuario}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="mb-3">
                            <label className="form-label">Número de teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.telefono && (
                                <div className="alert alert-danger mt-1">
                                    {errors.telefono}
                                </div>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="mb-3">
                            <label className="form-label">Dirección postal</label>
                            <input
                                type="text"
                                name="direccion"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.direccion && (
                                <div className="alert alert-danger mt-1">
                                    {errors.direccion}
                                </div>
                            )}
                        </div>

                        {/* Fecha */}
                        <div className="mb-4">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="fecha"
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.fecha && (
                                <div className="alert alert-danger mt-1">
                                    {errors.fecha}
                                </div>
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

                {/* Imagen + indicadores */}
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={robotgif}
                        alt="register visual"
                        className="login-image"
                    />
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
