import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../index.css";
import logo from "../imagenes/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

import Postulacion from "./Postulacion.jsx";
import { useOfertasGuardadas } from "../context/OfertasGuardadas.jsx";

export default function Navbar() {
	const [isPostulacionOpen, setIsPostulacionOpen] = useState(false);
	const [isSavedOpen, setIsSavedOpen] = useState(false);

	const { ofertasGuardadas, eliminarGuardada } = useOfertasGuardadas();

	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!dropdownRef.current) return;
			if (!dropdownRef.current.contains(e.target)) setIsSavedOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleOpen = () => setIsPostulacionOpen(true);
	const handleClose = () => setIsPostulacionOpen(false);

	return (
		<>
			<nav className="top-navbar">
				<div className="navbar-top-row">
					<div className="navbar-left">
						<div className="login-logo-form d-flex align-items-center mb-3">
							<img src={logo} alt="logo" className="logo-image" />
						</div>

						<div className="navbar-text">
							<h1 className="navbar__title">¡Futuro nombre super chulo!</h1>
							<span className="navbar__subtitle">Gestiona tus postulaciones de empleo</span>
						</div>
					</div>

					<div className="navbar-actions" ref={dropdownRef}>
						<button
							className="btn-saved"
							onClick={() => setIsSavedOpen((v) => !v)}
							type="button"
							aria-label="Abrir guardados"
						>
							<i className="bi bi-bookmark-fill"></i>
							{ofertasGuardadas.length > 0 && (
								<span className="saved-badge">{ofertasGuardadas.length}</span>
							)}
						</button>

						{isSavedOpen && (
							<div className="saved-dropdown">
								<h6 className="saved-dropdown-title">Ofertas Guardadas</h6>

								{ofertasGuardadas.length === 0 ? (
									<p className="saved-empty">No tienes ofertas guardadas</p>
								) : (
									<ul className="saved-list">
										{ofertasGuardadas.map((job) => (
											<li key={job.external_id} className="saved-item">
												<div className="saved-item-text">
													<span className="saved-title">{job.title}</span>
													<span className="saved-company">{job.company}</span>
												</div>

												<i
													className="bi bi-trash saved-trash"
													onClick={() => eliminarGuardada(job.external_id)}
													role="button"
													aria-label="Eliminar guardado"
													title="Eliminar"
												/>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						<button
							className="btn-new-postulation"
							onClick={handleOpen}
							type="button"
						>
							<span className="btn-plus">+</span>
							Nueva Postulación
						</button>
					</div>
				</div>

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
				</ul>
			</nav>

			<Postulacion isOpen={isPostulacionOpen} onClose={handleClose} />
		</>
	);
}
