import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, isTokenValid, removeToken, getRefreshToken, isTokenExpired, refreshAccessToken, removeRefreshToken } from "../utils/auth";

function Navbar() {
	const navigate = useNavigate();
	const [auth, setAuth] = useState(false);

	useEffect(() => {
		const t = getToken();
		if (t && isTokenValid(t)) {
			setAuth(true);
			return;
		}

		const r = getRefreshToken();
		if (r && !isTokenExpired(r)) {
			refreshAccessToken().then(newT => {
				if (newT) setAuth(true);
				else {
					removeToken();
					removeRefreshToken();
					setAuth(false);
				}
			});
			return;
		}

		removeToken();
		removeRefreshToken();
		setAuth(false);
	}, []);

	const handleLogout = () => {
		removeToken();
		setAuth(false);
		navigate("/");
	};
	return (
		<nav className="navbar navbar-expand-lg" style={{ background: "#8000ff" }}>
			<div className="container-fluid">
				<Link className="navbar-brand text-white fw-bold" to="/">Autenticacion</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							<Link className="nav-link text-white" to="/">Inicio</Link>
						</li>
						{!auth && (
							<>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/">Login</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/signup">Registro</Link>
								</li>
							</>
						)}
						{auth && (
							<>
								<li className="nav-item">
									<Link className="nav-link text-white" to="/private">Privado</Link>
								</li>
								<li className="nav-item">
									<button className="btn btn-warning ms-2" onClick={handleLogout}>Cerrar sesión</button>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;