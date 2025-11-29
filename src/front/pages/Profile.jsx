import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner, Modal } from "react-bootstrap";
import { user } from "../jsApiComponents/user";
import { deleteUser } from "../jsApiComponents/deleteUser";
import UpdateUser from "../components/UpdateUser";
import JoinedEvents from "../components/JoinedEvents";
import CreatedEvents from "../components/CreatedEvents";
import { toast } from "react-toastify";



export const Profile = () => {
  const [user_get, setUser_get] = useState(null);
  const [user_offlineMsg, setUser_offlineMsg] = useState("");
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileTab, setProfileTab] = useState("profile");

  const runLogOut = () => {
    localStorage.removeItem("JWT-STORAGE-KEY");
toast.success("🔐 Sesión cerrada correctamente");

    return navigate("/login");
  };

  const runDeleteUser = () => {
    deleteUser();
    toast.success("🗑️ Usuario eliminado con éxito");
    return navigate("/register");
  };

  const getUser = async () => {
    try {
      const response = await user();
      if (response.ok) {
        setUser_get(response.data);
      } else if (response.status === 401) {
        toast.error("Tu sesión ha caducado. Ingresa nuevamente");

        localStorage.removeItem("JWT-STORAGE-KEY");
        return navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const refreshUser = () => {
    getUser();
  };

  const userOfflineProcedure = () => {
    setInterval(() => {
      setUser_offlineMsg("Parece que tu sesión ha caducado, vuelve a iniciar sesión.");
    }, 2000);
  };

  if (user_get == null) {
    userOfflineProcedure();
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Spinner animation="border" variant="white" />
        <p>{user_offlineMsg}</p>
        <button className="mf-neon-btn mt-3" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column bg-dark text-light w-100 vh-100">

    <div className="row flex-grow-1 g-0">

        {/* SIDEBAR */}
        <div className="col-12 col-md-3 border-end bg-dark text-light p-3 mt-4">
          <h5 className="text-center mb-4">Mi Cuenta</h5>

          <button
            className={`mb-3 w-100 mf-neon-btn  ${profileTab === "profile" ? "active" : ""}`}
            onClick={() => setProfileTab("profile")}
          >
            Perfil
          </button>

          <button
            className={`mb-3 w-100 mf-neon-btn ${profileTab === "created" ? "active" : ""}`}
            onClick={() => setProfileTab("created")}
          >
            Mis Eventos Creados
          </button>

          <button
            className={`mb-3 w-100 mf-neon-btn ${profileTab === "joined" ? "active" : ""}`}
            onClick={() => setProfileTab("joined")}
          >
            Eventos a los que Me Apunté
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="col-12 col-md-9 d-flex flex-column" style={{ height: "100vh", overflowY: "auto" }}>

          <Container fluid className="d-flex flex-column bg-dark text-light py-5">

            {/* PERFIL */}
            {profileTab === "profile" && (
              <Row className="g-4 w-100 px-2">
                <Col>
                  <Card className="profile-stable-card">

                    {!editing && (
                      <div className="text-center">

                        <div className="mb-3">
                          <img
                            src={user_get.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="avatar"
                            className="profile-avatar"
                          />
                        </div>

                        <h4>{user_get.name} {user_get.lastname || "Sin apellido"}</h4>

                        <p className="text-light opacity-75 mb-1">
                          <strong>Correo:</strong> {user_get.email}
                        </p>

                        <h5>Biografía</h5>
                        <p className="text-light small">
                          {user_get.biography || "Aún no tienes biografía. ¡Añade algo!"}
                        </p>

                        <hr />
                        <div className="text-start px-3">
                          <p><strong>Deporte favorito:</strong> {user_get.sports || "Sin especificar"}</p>
                          <p><strong>Nivel:</strong> {user_get.level || "Sin especificar"}</p>
                        </div>
                        <hr />

                        <button className="mt-3 w-100 mf-neon-btn" onClick={() => setEditing(true)}>
                          Editar perfil
                        </button>

                        <button className="mt-3 w-100 mf-neon-btn" onClick={runLogOut}>
                          Cerrar sesión
                        </button>

                        <button
                          className="mt-3 w-100 mf-neon-btn mf-neon-btn--danger"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Eliminar Usuario
                        </button>

                        <Modal
                          show={showDeleteModal}
                          onHide={() => setShowDeleteModal(false)}
                          centered
                          backdrop="static"
                        >
                          <Modal.Header closeButton className="custom-navbar meetfit-text-custom">
                            <Modal.Title>Eliminar Usuario</Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="bg-dark text-light text-center meetfit">
                            <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
                            <p className="text-danger fw-bold">Esta acción no se puede deshacer.</p>
                          </Modal.Body>
                          <Modal.Footer className="bg-dark meetfit-text-custom p-2">

                            <button className="mf-neon-btn--outline" onClick={() => setShowDeleteModal(false)}>
                              Cancelar
                            </button>

                            <button className="mf-neon-btn mf-neon-btn--danger" onClick={runDeleteUser}>
                              Confirmar eliminación
                            </button>
                          </Modal.Footer>
                        </Modal>

                      </div>
                    )}

                    {editing && (
                      <div>
                        <UpdateUser
                          user_bio={user_get.biography}
                          user_sports={user_get.sports}
                          user_level={user_get.level}
                          user_lastname={user_get.lastname}
                          refreshUser={refreshUser}
                        />

                        <button className="mt-3 w-100 mf-neon-btn" onClick={() => setEditing(false)}>
                          Volver al perfil
                        </button>
                      </div>
                    )}

                  </Card>
                </Col>
              </Row>
            )}

            {/* EVENTOS CREADOS */}
            {profileTab === "created" && (
              <Row className="g-4 justify-content-center w-100 px-2">
                <Col className="d-flex justify-content-center">
                  <Card className="profile-stable-card text-center">
                    <CreatedEvents />
                  </Card>
                </Col>
              </Row>
            )}

            {/* EVENTOS APUNTADOS */}
            {profileTab === "joined" && (
              <Row className="g-4 justify-content-center w-100 px-2">
                <Col className="d-flex justify-content-center">
                  <Card className="profile-stable-card text-center">
                    <JoinedEvents />
                  </Card>
                </Col>
              </Row>
            )}

          </Container>
          
        </div>
        <br></br><br></br>
      </div>
    </div>
  );
};
