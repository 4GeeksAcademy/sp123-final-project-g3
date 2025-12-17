import fondoInicio from "../assets/img/fondo-inicio.webp";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken, setRefreshToken } from "../utils/auth";

export default function Home() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [registeredName, setRegisteredName] = useState("");

	useEffect(() => {
		try { setRegisteredName(localStorage.getItem('registered_name') || ''); } catch (e) { setRegisteredName(''); }
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoginError('');
		try {
			const res = await fetch(`/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (res.status === 200) {
				const data = await res.json();
				setToken(data.token);
				if (data.refresh_token) setRefreshToken(data.refresh_token);
				navigate('/private');
			} else {
				const body = await res.json().catch(() => ({}));
				setLoginError(body.msg || 'Error en inicio de sesión');
			}
		} catch (err) {
			setLoginError('No se pudo conectar con el servidor: ' + (err.message || err));
		}
	};

	return (
		<div style={{
			height: "100vh",
			overflow: "hidden",
			backgroundImage: `url(${fondoInicio})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "space-between",
			paddingTop: "2.5rem",
		}}>
			{/* Left: login form */}
			<div style={{ width: '36%', paddingLeft: '2%', boxSizing: 'border-box' }}>
				<form onSubmit={handleLogin} className="p-4 rounded shadow" style={{ background: "#fff", maxWidth: "400px", width: "100%", marginLeft: 0 }}>
					<h2 className="mb-4 text-center" style={{ color: "#8000ff" }}>Iniciar sesión</h2>
					{registeredName && (
						<div className="mb-3">
							<div className="text-muted">Hola, {registeredName.charAt(0).toUpperCase() + registeredName.slice(1)}</div>
						</div>
					)}
					<div className="mb-3">
						<label className="form-label">Email</label>
						<input autoComplete="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
					</div>
					<div className="mb-3">
						<label className="form-label">Contraseña</label>
						<input autoComplete="current-password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
					</div>
					<button type="submit" className="btn btn-warning w-100">Iniciar sesión</button>
					{loginError && <div className="alert alert-danger mt-3" role="alert">{loginError}</div>}
					<div className="mt-3 text-center w-100">
						<Link to="/signup" className="btn btn-link p-0">¿No tienes cuenta? Regístrate ahora</Link>
					</div>
				</form>
			</div>


		</div>
	);
}

