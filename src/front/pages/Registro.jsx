import "../index.css";
import { Link } from "react-router-dom";
import mascotaregistro from "../imagenes/roboregistro.png";

export default function Registro() {
    return (
        <div className="login-container">

            {/* Wrapper para formulario + imagen */}
            <div className="login-wrapper">

                {/* Formulario */}
                <div className="login-form">

                    {/* Logo encima */}
                    <div className="login-logo-form mx-auto mb-3">
                        <div className="logo-shape-1"></div>
                        <div className="logo-shape-2"></div>
                        <h3 className="fw-bold ms-2">Logo Futuro</h3>
                    </div>

                    <h1 className="fw-semibold text-center">Crea tu cuenta</h1>
                    <p className="login-subtitle text-center">
                        Crea tu nueva cuenta para comenzar
                    </p>

                    <form className="mt-4">

                        {/* Nombre / Apellidos */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>

                        {/* Nombre de usuario */}
                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario</label>
                            <input type="text" className="form-control" />
                        </div>

                        {/* Correo electrónico */}
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" />
                        </div>

                        {/* Número de teléfono */}
                        <div className="mb-3">
                            <label className="form-label">Número de teléfono</label>
                            <input type="tel" className="form-control" />
                        </div>

                        {/* Dirección postal */}
                        <div className="mb-3">
                            <label className="form-label">Dirección postal</label>
                            <input type="text" className="form-control" />
                        </div>

                        {/* Fecha de nacimiento */}
                        <div className="mb-4">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input type="date" className="form-control" />
                        </div>

                        {/* Botón */}
                        <button className="btn btn-primary w-100 mb-3">
                            Crear cuenta
                        </button>

                        {/* Link login */}
                        <p className="text-center">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/" className="fw-semibold">
                                Inicia sesión
                            </Link>
                        </p>

                    </form>
                </div>

                {/* Imagen lateral + indicadores */}
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={mascotaregistro}
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
