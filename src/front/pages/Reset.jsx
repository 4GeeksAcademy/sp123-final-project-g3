// UI de reseteo: lee :token de la URL, valida dos contraseñas y navega al login.
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import TextInput from "../components/TextInput";

export function Reset() {
  const { token } = useParams();
  const nav = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!token) return setErr("Falta el token de recuperación en la URL.");
    if (p1.length < 8) return setErr("La contraseña debe tener al menos 8 caracteres.");
    if (p1 !== p2) return setErr("Las contraseñas no coinciden.");
    console.log("Reset (solo UI):", { token, new_password: p1 });
    nav("/login");
  };

  return (
    <AuthShell title="Restablecer contraseña" subtitle="Introduce y confirma tu nueva contraseña">
      {!token && (
        <div className="alert alert-warning py-2">
          No se encontró ningún token en la URL. Vuelve a <Link to="/forgot" className="link-accent">Recuperar contraseña</Link>.
        </div>
      )}
      <form onSubmit={submit} noValidate>
        <TextInput
          label="Nueva contraseña"
          name="p1"
          value={p1}
          onChange={(e) => setP1(e.target.value)}
          withToggle
          placeholder="••••••••"
        />
        <TextInput
          label="Repite la nueva contraseña"
          name="p2"
          value={p2}
          onChange={(e) => setP2(e.target.value)}
          withToggle
          placeholder="••••••••"
        />
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <button className="btn btn-accent w-100">Confirmar nueva contraseña</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login" className="link-accent">Volver al login</Link>
      </div>
    </AuthShell>
  );
}
