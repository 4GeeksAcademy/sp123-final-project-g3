import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registroImg from "../assets/img/registro.jpg";

function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [registered, setRegistered] = useState(false);
    const [registeredName, setRegisteredName] = useState('');

    const [fieldErrors, setFieldErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!firstName.trim()) errs.firstName = 'Nombre requerido';
        if (!lastName.trim()) errs.lastName = 'Apellidos requeridos';
        if (!email.trim()) errs.email = 'Email requerido';
        if (!password) errs.password = 'Contraseña requerida';
        if (!confirmPassword) errs.confirmPassword = 'Confirmar contraseña';
        if (password && confirmPassword && password !== confirmPassword) errs.passwordMatch = 'Las contraseñas deben coincidir';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        try {
            const BASE = import.meta.env.VITE_BACKEND_URL || '';
            const res = await fetch(`${BASE}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
            });
            if (res.status === 201) {
                setRegistered(true);
                const nameToStore = (firstName || '').trim();
                setRegisteredName(nameToStore);
                try { localStorage.setItem('registered_name', nameToStore); } catch (e) { }
            } else {
                const body = await res.json().catch(() => ({}));
                setError(body.msg || `Error registrando usuario (status ${res.status})`);
                console.error('Signup failed', res.status, body);
            }
        } catch (err) {
            console.error('Network/signup error', err);
            setError('No se pudo conectar con el servidor: ' + (err.message || err));
        }
    };

    return (
        <div style={{
            height: "100vh",
            overflow: "hidden",
            backgroundImage: `url(${registroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: "2%",
            paddingRight: "2%",
            boxSizing: "border-box"
        }}>
            {!registered && (
                <form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ background: "#fff", maxWidth: "400px", width: "100%", marginLeft: 0 }}>
                    <h2 className="mb-4 text-center" style={{ color: "#8000ff" }}>Registro</h2>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input autoComplete="given-name" type="text" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Nombre" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Apellidos</label>
                        <input autoComplete="family-name" type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Apellidos" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input autoComplete="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input autoComplete="new-password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input autoComplete="new-password" type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" required />
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {fieldErrors && fieldErrors.passwordMatch && <div className="alert alert-danger" role="alert">{fieldErrors.passwordMatch}</div>}
                    {(fieldErrors && Object.keys(fieldErrors).length > 0) && (
                        <div className="mb-3">
                            {fieldErrors.firstName && <div className="text-danger">{fieldErrors.firstName}</div>}
                            {fieldErrors.lastName && <div className="text-danger">{fieldErrors.lastName}</div>}
                            {fieldErrors.email && <div className="text-danger">{fieldErrors.email}</div>}
                            {fieldErrors.password && <div className="text-danger">{fieldErrors.password}</div>}
                            {fieldErrors.confirmPassword && <div className="text-danger">{fieldErrors.confirmPassword}</div>}
                        </div>
                    )}
                    <button type="submit" className="btn btn-warning w-100">Registrarse</button>
                </form>
            )}
            {registered && (
                <div style={{ maxWidth: 400, width: '100%', marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                    <div className="alert alert-success text-center" role="alert" style={{ width: '100%' }}>
                        <div>Te has registrado correctamente{registeredName ? `, ${registeredName.charAt(0).toUpperCase() + registeredName.slice(1)}` : ''}!</div>
                        <div className="mt-2 text-center">
                            <button className="btn btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Signup;
