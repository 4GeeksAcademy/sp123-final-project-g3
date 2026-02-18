import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../index.css";
import logo from "../imagenes/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

import Postulation from "./Postulation.jsx";
import { useSavedOffers } from "../context/SavedOffers.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export default function Navbar() {
	const [postulationOpen, setPostulationOpen] = useState(false);
	const [savedOpen, setSavedOpen] = useState(false);
	const [showAuthAlert, setShowAuthAlert] = useState(false);
	const [authMessage, setAuthMessage] = useState("");

	const { savedOffers, removeSaved } = useSavedOffers();
	const { store, actions } = useGlobalReducer(); // Destructure actions, not dispatch
	const navigate = useNavigate();

	const isAuthenticated = !!(store.token || localStorage.getItem("token"));

	const dropdownReference = useRef(null);
	const userMenuReference = useRef(null);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!dropdownReference.current) return;
			if (!dropdownReference.current.contains(event.target)) setSavedOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleClickOutsideUserMenu = (event) => {
			if (!userMenuReference.current) return;
			if (!userMenuReference.current.contains(event.target)) setUserMenuOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutsideUserMenu);
		return () => document.removeEventListener("mousedown", handleClickOutsideUserMenu);
	}, []);

	const showAuthFeedback = (message) => {
		setAuthMessage(message);
		setShowAuthAlert(true);
	};

	const closeAuthAlert = () => {
		setShowAuthAlert(false);
	};

	const goToLogin = () => {
		closeAuthAlert();
		navigate("/login");
	};

	const goToRegister = () => {
		closeAuthAlert();
		navigate("/register");
	};

	const handleLogout = () => {
		actions.logout(); // Use actions.logout()
		setUserMenuOpen(false);
		navigate('/search');
	};

	const handleOpen = () => {
		if (!isAuthenticated) {
			showAuthFeedback("You must log in to add postulations");
			return;
		}
		setPostulationOpen(true);
	};
	const handleClose = () => setPostulationOpen(false);

	return (
		<>
			<nav className="top-navbar">
				<div className="navbar-top-row">
					<div className="navbar-left">
						<div className="login-logo-form d-flex align-items-center mb-3">
							<img src={logo} alt="logo" className="logo-image" />
						</div>

						<div className="navbar-text">
							<h1 className="navbar__title">Super cool future name!</h1>
							<span className="navbar__subtitle">Manage your job applications</span>
						</div>
					</div>

					<div className="navbar-actions" ref={dropdownReference}>
						<button
							className={`btn-saved ${!isAuthenticated ? 'btn-saved--locked' : ''}`}
							onClick={() => {
								if (!isAuthenticated) {
									showAuthFeedback("You must log in to view your saved offers");
									return;
								}
								setSavedOpen((value) => !value);
							}}
							type="button"
							aria-label={isAuthenticated ? "Open saved" : "Log in to view saved offers"}
							title={isAuthenticated ? "View saved offers" : "Log in to view saved offers"}
						>
							<i className={`bi ${isAuthenticated ? 'bi-bookmark-fill' : 'bi-lock-fill'}`}></i>
							{isAuthenticated && savedOffers.length > 0 && (
								<span className="saved-badge">{savedOffers.length}</span>
							)}
						</button>

						{savedOpen && (
							<div className="saved-dropdown">
								<h6 className="saved-dropdown-title">Saved Offers</h6>

								{savedOffers.length === 0 ? (
									<p className="saved-empty">You have no saved offers</p>
								) : (
									<ul className="saved-list">
										{savedOffers.map((job) => (
											<li key={job.external_id} className="saved-item">
												<div className="saved-item-text">
													<span className="saved-title">{job.title}</span>
													<span className="saved-company">{job.company}</span>
												</div>

												<i
													className="bi bi-trash saved-trash"
													onClick={() => removeSaved(job.external_id)}
													role="button"
													aria-label="Remove saved"
													title="Remove"
												/>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						<button
							className={`btn-new-postulation ${!isAuthenticated ? 'btn-new-postulation--locked' : ''}`}
							onClick={handleOpen}
							type="button"
							title={isAuthenticated ? "Add new postulation" : "Log in to add postulations"}
						>
							<i className={`bi ${isAuthenticated ? 'bi-plus-lg' : 'bi-lock-fill'} btn-plus`}></i>
							{isAuthenticated ? 'New Postulation' : 'Log in'}
						</button>

						{!isAuthenticated ? (
							<button
								className="btn-login"
								onClick={() => navigate('/login')}
								type="button"
								title="Log in"
							>
								<i className="bi bi-box-arrow-in-right"></i>
								<span className="btn-login-text">Log in</span>
							</button>
						) : (
							<div className="user-menu" ref={userMenuReference}>
								<button
									className="btn-user"
									onClick={() => setUserMenuOpen((value) => !value)}
									type="button"
									aria-label="User menu"
									title="My account"
								>
									<i className="bi bi-person-circle"></i>
									<span className="btn-user-text">
										{store.user?.name || store.user?.email || 'My Account'}
									</span>
									<i className={`bi bi-chevron-${userMenuOpen ? 'up' : 'down'} user-menu-arrow`}></i>
								</button>

								{userMenuOpen && (
									<div className="user-dropdown">
										<div className="user-dropdown-header">
											<i className="bi bi-person-circle user-dropdown-avatar"></i>
											<div className="user-dropdown-info">
												<span className="user-dropdown-name">
													{store.user?.name || 'User'}
												</span>
												<span className="user-dropdown-email">
													{store.user?.email || ''}
												</span>
											</div>
										</div>
										<div className="user-dropdown-divider"></div>
										<Link
											to="/profile"
											className="user-dropdown-item"
											onClick={() => setUserMenuOpen(false)}
										>
											<i className="bi bi-person"></i>
											My Profile
										</Link>
										<button
											className="user-dropdown-item user-dropdown-item--logout"
											onClick={handleLogout}
											type="button"
										>
											<i className="bi bi-box-arrow-right"></i>
											Log out
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<ul className="navbar-menu">
					<li>
						<Link
							to="/board"
							className={`nav-item ${!isAuthenticated ? 'nav-item--locked' : ''}`}
							onClick={(event) => {
								if (!isAuthenticated) {
									event.preventDefault();
									showAuthFeedback("You must log in to access the Kanban Board");
								}
							}}
							title={isAuthenticated ? "Kanban Board" : "Log in to access"}
						>
							<i className={`bi me-2 ${isAuthenticated ? 'bi-layers' : 'bi-lock-fill'}`}></i>
							Kanban Board
						</Link>
					</li>
					<li>
						<NavLink
							to="/statistics"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${!isAuthenticated ? 'nav-item--locked' : ''}`}
							onClick={(event) => {
								if (!isAuthenticated) {
									event.preventDefault();
									showAuthFeedback("You must log in to view Statistics");
								}
							}}
							title={isAuthenticated ? "Statistics" : "Log in to access"}
						>
							<i className={`bi me-2 ${isAuthenticated ? 'bi-bar-chart' : 'bi-lock-fill'}`}></i>
							Statistics
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/profile"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${!isAuthenticated ? 'nav-item--locked' : ''}`}
							onClick={(event) => {
								if (!isAuthenticated) {
									event.preventDefault();
									showAuthFeedback("You must log in to view your Profile");
								}
							}}
							title={isAuthenticated ? "My Profile" : "Log in to access"}
						>
							<i className={`bi me-2 ${isAuthenticated ? 'bi-person' : 'bi-lock-fill'}`}></i>
							My Profile
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/search"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<i className="bi bi-search me-2"></i>
							Search Postulations
						</NavLink>
					</li>
				</ul>
			</nav>

			<Postulation isOpen={postulationOpen} onClose={handleClose} />

			{showAuthAlert && (
				<div
					className="auth-alert-overlay"
					onClick={(event) => {
						if (event.target === event.currentTarget) {
							closeAuthAlert();
						}
					}}
				>
					<div className="auth-alert">
						<button
							className="auth-alert-close"
							onClick={closeAuthAlert}
							aria-label="Close"
						>
							×
						</button>
						<i className="bi bi-lock-fill auth-alert-icon"></i>
						<p className="auth-alert-message">{authMessage}</p>
						<p className="auth-alert-subtitle">
							Log in or create an account to continue
						</p>
						<div className="auth-alert-actions">
							<button
								className="auth-alert-btn auth-alert-btn--primary"
								onClick={goToLogin}
							>
								<i className="bi bi-box-arrow-in-right me-2"></i>
								Log in
							</button>
							<button
								className="auth-alert-btn auth-alert-btn--secondary"
								onClick={goToRegister}
							>
								<i className="bi bi-person-plus me-2"></i>
								Create account
							</button>
						</div>
						<button
							className="auth-alert-btn auth-alert-btn--link"
							onClick={closeAuthAlert}
						>
							Later
						</button>
					</div>
				</div>
			)}
		</>
	);
}
