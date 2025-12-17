import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, removeToken, getToken, getRefreshToken, refreshAccessToken } from "../utils/auth";
import inicioImg from "../assets/img/inicio-sesion.jpg";

function Private() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAndFetch = async () => {
            let token = getToken();
            if (!token || isTokenExpired(token)) {
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    removeToken();
                    navigate("/");
                    return;
                }
                token = newToken;
            }

            try {
                const res = await fetch(`/api/private`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.status !== 200) {
                    removeToken();
                    navigate("/");
                    return;
                }
                const data = await res.json();
                setEmail(data.email);
            } catch (e) {
                removeToken();
                navigate("/");
            }
        };

        checkAndFetch();
    }, [navigate]);

    const handleLogout = () => {
        removeToken();
        navigate("/");
    };

    // obtener nombre registrado desde localStorage (establecido durante el registro)
    let registeredName = '';
    try { registeredName = localStorage.getItem('registered_name') || ''; } catch (e) { registeredName = ''; }
    const rawName = registeredName || (email ? email.split('@')[0] : '');
    const displayName = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : '';

    return (
        <div
            className="w-100 d-flex flex-column align-items-start justify-content-center"
            style={{
                height: "100vh",
                overflow: "hidden",
                width: '100%',
                padding: 0,
                margin: 0,
                backgroundImage: `url(${inicioImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="p-4 rounded shadow text-start" style={{ background: "rgba(255,255,255,0.88)", maxWidth: "420px", width: "100%", marginLeft: '2rem' }}>
                <h2 className="mb-2" style={{ color: "#8000ff" }}>Bienvenido</h2>
                <p className="lead mb-4" style={{ color: "#8000ff" }}>{displayName}</p>
                <button className="btn btn-warning w-100" onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
}
export default Private;
