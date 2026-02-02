
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "../index.css";
import logo from "../imagenes/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

import Postulacion from "./Postulacion.jsx";

export default function Navbar() {
	const [isPostulacionOpen, setIsPostulacionOpen] = useState(false);
	
	const handleOpen = () => setIsPostulacionOpen(true);
	const handleClose = () => setIsPostulacionOpen(false);
	
	const handleCreate = (data) => {
    console.log("Nueva postulación:", data);
    setIsPostulacionOpen(false);
	};
	
return (
		<>	
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
					<button className="btn-new-postulation" onClick={handleOpen} type="button">
						<span className="btn-plus">+</span>
						Nueva Postulación
					</button>
				</div>

				{/* MENÚ */}
				<ul className="navbar-menu">
					<li>
						<Link to="/" className="nav-item">
							<i className="bi bi-layers me-2"></i>
							Tablero Kanban
						</Link>
					</li>
					<li>
						<NavLink to="/estadisticas" className="nav-item">
							<i className="bi bi-bar-chart me-2"></i>
							Estadísticas
						</NavLink>
					</li>
					<li>
						<NavLink to="/perfil" className="nav-item">
							<i className="bi bi-person me-2"></i>
							Mi Perfil
						</NavLink>
					</li>
					<li>
						<NavLink to="/buscar" className="nav-item">
							<i className="bi bi-search me-2"></i>
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
			<Postulacion
			isOpen={isPostulacionOpen}
			onClose={handleClose}
			onCreate={handleCreate}
			/>
		</>
	);
}
