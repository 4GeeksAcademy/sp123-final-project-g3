import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import mascota from "../imagenes/robot.png";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-form">
                    <div className="login-logo-form mx-auto mb-3">
                        <div className="logo-shape-1"></div>
                        <div className="logo-shape-2"></div>
                        <h3 className="fw-bold ms-2">Logo Futuro</h3>
                    </div>

                    <h1 className="fw-semibold text-center">Inicio de Sesión</h1>
                    <p className="login-subtitle text-center">
                        Inicia sesión para acceder a tu tablero de empleos
                    </p>

                    <form className="mt-4">
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="john.doe@gmail.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••••••"
                            />
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
                    <img src={mascota} alt="login visual" className="login-image" />
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
