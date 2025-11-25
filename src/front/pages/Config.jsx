import React, { useState, useEffect } from "react";
import Form from "../components/Form.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Sidebar } from "../components/Sidebar";
import { div } from "framer-motion/m";


export const Config = () => {
  const { store, dispatch } = useGlobalReducer();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState({ email: store.profile?.email || "", password: "********" });
  const [errorMsn, setErrorMsn] = useState(null);
  const [successMsn, setSuccessMsn] = useState(null);
  const [newEmail, setNewEmail] = useState(store.profile?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = store.token || localStorage.getItem("token");
      try {
        const res = await fetch(`${backendUrl}/api/users/${store.user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const email = data.perfil?.email || data.email || "";
          setUserData({ email, password: "********" });
          setNewEmail(email);
          dispatch({ type: "UPDATE_PROFILE", payload: { email } });
        } else {
          setErrorMsn(data.msg || "Error al obtener datos del usuario");
        }
      } catch {
        setErrorMsn("Error al conectar con el servidor");
      }
    };
    if (store.user?.id) fetchUser();
  }, [store.user?.id]);

  const handleConfigSubmit = async ({ newEmail, newPassword, setErrorMsn }) => {
    setErrorMsn(null);
    setSuccessMsn(null);
    const token = store.token || localStorage.getItem("token");
    const body = {};
    if (newEmail) body.email = newEmail;
    if (newPassword) body.password = newPassword;

    try {
      const res = await fetch(`${backendUrl}/api/users/${store.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (newEmail) {
          setUserData((prev) => ({ ...prev, email: newEmail }));
          dispatch({ type: "UPDATE_PROFILE", payload: { email: newEmail } });
        }
        if (newPassword) setUserData((prev) => ({ ...prev, password: "********" }));
        setSuccessMsn("Cambios guardados correctamente");
      } else {
        setErrorMsn(data.msg || "Error al actualizar datos");
      }
    } catch {
      setErrorMsn("Error al conectar con el servidor");
    }
  };

  return (
    <div className="d-flex">
      <div><Sidebar/></div>
      <div className="">
        <Form
          mode="config"
          userData={userData}
          onSubmit={handleConfigSubmit}
          successMessage={successMsn}
        />
      </div>
    </div>
  );
};