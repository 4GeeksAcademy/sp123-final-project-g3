import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const BASE = import.meta.env.VITE_BACKEND_URL || "";
            const res = await fetch(`${BASE}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Credenciales incorrectas");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="mb-3">Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <div className="alert alert-danger">{error}</div>}
                <button className="btn btn-primary w-100">Entrar</button>
            </form>
        </div>
    );
}
export default Login;
