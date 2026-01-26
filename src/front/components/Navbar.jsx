
import { NavLink, Link } from "react-router-dom";
import "../index.css";
import logo from "../imagenes/logo.png";

export default function Navbar() {
	return (
		<nav className="top-navbar">

			{/* FILA SUPERIOR */}
			<div className="navbar-top-row">

				{/* IZQUIERDA: LOGO + TEXTO */}
				<div className="navbar-left">
					<div className="login-logo-form d-flex align-items-center mb-3">
						<img src={logo} alt="logo" className="logo-image" />
					</div>

					<div className="navbar-text">
						<h1>¡Futuro nombre super chulo!</h1>
						<span>Gestiona tus postulaciones de empleo</span>
					</div>
				</div>

				{/* DERECHA: BOTÓN */}
				<button className="btn-new-postulation">
					<span className="btn-plus">+</span>
					Nueva Postulación
				</button>
			</div>

			{/* MENÚ */}
			<ul className="navbar-menu">
				<li>
					<Link to="/" className="nav-item">
						Tablero Kanban
					</Link>
				</li>
				<li>
					<NavLink to="/estadisticas" className="nav-item">
						Estadísticas
					</NavLink>
				</li>
				<li>
					<NavLink to="/perfil" className="nav-item">
						Mi Perfil
					</NavLink>
				</li>
				<li>
					<NavLink to="/buscar" className="nav-item">
						Buscar Postulaciones
					</NavLink>
				</li>
				<li>
					<Link to="/login" className="nav-item">
						Login
					</Link>
				</li>
				<li>
					<Link to="/registro" className="nav-item">
						Registro
					</Link>
				</li>
			</ul>

		</nav>
	);
}
