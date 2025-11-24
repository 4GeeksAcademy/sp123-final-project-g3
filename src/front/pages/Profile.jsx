import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner, Dropdown } from "react-bootstrap";
import { user } from "../jsApiComponents/user";
import { deleteUser } from "../jsApiComponents/deleteUser";
import UpdateUser from "../components/UpdateUser";

export const Profile = () => {
  const [user_get, setUser_get] = useState(null);
  const [user_offlineMsg, setUser_offlineMsg] = useState("")
  const navigate = useNavigate();
  const user_id = localStorage.getItem('USER')

  const runLogOut = () => {
    localStorage.removeItem("JWT-STORAGE-KEY");
    alert('Sesion cerrada correctamente!')
    return navigate('/login')
  }
  const runDeleteUser = () => {
    deleteUser()
    alert('Tu usuario ha sido eliminado correctamente!')
    return navigate('/register')
  }

  const getUser = async () => {
    try {
      const response = await user()
      if (response.ok) {
        setUser_get(response.data)
        console.log(user_get)
      } else if (response.status == 401) {
        alert('Tu sesion ha caducado!')
        return navigate('/login')
      }

    } catch (error) {
      console.log("Error fetching user:", error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])
  const refreshUser = () => {
    getUser()
  }


  const userOfflineProcedure = () => {
    setInterval(() => {
      setUser_offlineMsg("Parece que tu sesion ha caducado, vuelve a iniciar sesion.")


    }, 2000)
  }
  if (user_get == null) {

    userOfflineProcedure()
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column gap-">
        <Spinner animation="border" variant="white" />
        <p>{user_offlineMsg}</p>
        <Button
          variant="success"
          className="mt-3"
          onClick={() => navigate('/login')}
        >
          Iniciar sesion
        </Button>
      </div>
    );
  }
  return (
    <Container
      fluid
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-light py-5"
    >
      <Card className="p-4 bg-secondary text-center" style={{ maxWidth: "400px", borderRadius: "20px" }}>
        <div className="mb-3">
          <img
            src={user_get.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="avatar"
            className="rounded-circle"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>
        <h4>{user_get.name}</h4>
        <h4>{user_get.lastname || "Sin apellidos."}</h4>
        <p className="text-light opacity-75 mb-1">{user_get.email}</p>
        <p className="text-light small">{user_get.biography || "No biography yet"}</p>

        <hr />
        <div className="text-start px-3">
          <p><strong>Deporte:</strong> {user_get.sports || "Not specified"}</p>
          <p><strong>Nivel:</strong> {user_get.level || "Not specified"}</p>
        </div>


        <UpdateUser user_bio={user_get.biography} user_sports={user_get.sports} user_level={user_get.level} user_lastname={user_get.lastname} refreshUser={refreshUser} />


        <Button
          variant="warning"
          className="mt-3"
          onClick={runLogOut}
        >
          Cerrar sesion
        </Button>


        <Dropdown className="mt-3">
          <Dropdown.Toggle className=" w-100">
            Eliminar Usuario
          </Dropdown.Toggle>

          <Dropdown.Menu className="text-center bg-dark">
            <Dropdown.ItemText className="text-light">
              ¿Estás seguro?
            </Dropdown.ItemText>

            <Dropdown.Divider />

            <Dropdown.Item as="button" className="text-danger fw-bold" onClick={runDeleteUser}>
              Confirmar eliminación
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>


      </Card>
    </Container>
  );
};
