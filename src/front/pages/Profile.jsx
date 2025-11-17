import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { user } from "../jsApiComponents/user";
import UseLogOut from "../jsApiComponents/logout";
import { deleteUser } from "../jsApiComponents/deleteUser";
export const Profile = () => {
  const [user_get, setUser_get] = useState(null);
  const [user_offlineMsg, setUser_offlineMsg] = useState("")
  const navigate = useNavigate();


  const runLogOut = () => {
    const logOut = UseLogOut()
    alert('Sesion cerrada correctamente!')
    return navigate('/login')
  }
  const runDeleteUser = () =>{
    const deleteCurrentUser = deleteUser()
    alert('Tu usuario ha sido eliminado correctamente!')
    return navigate('/register')
  }
  
const getUser = async () => {
  try {
    const response = await user()
    if (response.ok){
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

  const userOfflineProcedure = () =>{
    setInterval(()=>{
      setUser_offlineMsg("Parece que tu sesion ha caducado, vuelve a iniciar sesion.")
    }, 5000)
  }
  if (user_get == null)
    userOfflineProcedure()
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column gap-4">
        <Spinner animation="border" variant="dark" />
        <p>{user_offlineMsg}</p>
      </div>
    );

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
        <p className="text-light opacity-75 mb-1">{user_get.email}</p>
        <p className="text-light small">{user_get.biography || "No biography yet"}</p>

        <hr />
        <div className="text-start px-3">
          <p><strong>Deporte:</strong> {user_get.sports || "Not specified"}</p>
          <p><strong>Nivel:</strong> {user_get.level || "Not specified"}</p>
        </div>

        <Button
          variant="success"
          className="mt-3"
          onClick={() => navigate("/edit-profile")}
        >
          Editar Perfil
        </Button>
        <Button
          variant="warning"
          className="mt-3"
          onClick={() => {
            return runLogOut
          }}
        >
          Cerrar sesion
        </Button>
        <Button
          variant="danger"
          className="mt-3"
          onClick={() => {
            return runDeleteUser
          }}
        >
          Eliminar Usuario 
        </Button>

      </Card>
    </Container>
  );
};
