
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { user } from '../jsApiComponents/user';
import { updateUser } from '../jsApiComponents/auth';
import { Button, Dropdown, Form } from 'react-bootstrap';
export default function UpdateUser({ refreshUser ,user_bio, user_sports, user_level, user_lastname }) {
    const [info, setInfo] = useState({ bio: "", sports: "", level: "", lastname: "" })
    const [errors, setErrors] = useState({});
    const userID = localStorage.getItem('USER')

    const navigate = useNavigate()

    const updateSuccess = async (e) => {
        e.preventDefault()
        const body = {
            "lastname": info.lastname,
            "bio": info.bio,
            "sports": info.sports,
            "level": info.level,
        }
        e.preventDefault();

        const data = await updateUser(body, userID)
        if (data.status == 400) {
            alert('Algo ha salido mal!')
        }
        if (data.status == 200) {
            alert('Has actualizado la info correctamente!')
            refreshUser()
            navigate('/profile')
        }
    }

    // const getUserInfo = () => {
        

    // }

    useEffect(() => {
        setInfo({ bio: user_bio, sports: user_sports, level: user_level, lastname: user_lastname })
    }, [user_bio, user_sports, user_level, user_lastname])




    const recoverBio = (e) => {
        setInfo({ ...info, bio: e.target.value })
    }
    const recoverLevel = (e) => {
        setInfo({ ...info, level: e.target.value })
    }
    const recoverSport = (e) => {
        setInfo({ ...info, sports: e.target.value })
    }
    const recoverName = (e) => {
        setInfo({ ...info, name: e.target.value })
    }
    const recoverLastname = (e) => {
        setInfo({ ...info, lastname: e.target.value })
    }
    return (
        <>
{/* 
            <Button
                type='button'
                className="btn btn-warning dropdown-toggle btn-success"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-auto-close="outside"
            >
                Editar Perfil
            </Button> */}
<Dropdown style={{ minWidth: "300px" }} className="mt-2">
      <Dropdown.Toggle variant="info" className='w-100 custom-navbar p-1'>
        Editar perfil
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-4 m-2 text-center bg-dark text-light">
        <Form onSubmit={updateSuccess}>

          {/* Bio */}
          <Form.Group className="mb-3">
            <Form.Label><h4>Bio</h4></Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Hola soy Sergio..."
              value={info.bio}
              onChange={recoverBio}
              rows={3}
            />
          </Form.Group>

          {/* Deporte */}
          <Form.Group className="mb-3">
            <Form.Label><h4>Deporte</h4></Form.Label>
            <Form.Control
              type="text"
              placeholder="Correr, Tenis, Fútbol..."
              value={info.sports}
              onChange={recoverSport}
            />
          </Form.Group>

          {/* Nivel */}
          <Form.Group className="mb-3">
            <Form.Label><h4>Nivel</h4></Form.Label>
            <Form.Control
              type="text"
              placeholder="Principiante, Intermedio..."
              value={info.level}
              onChange={recoverLevel}
            />
          </Form.Group>

          {/* Apellidos */}
          <Form.Group className="mb-3">
            <Form.Label><h4>Apellidos</h4></Form.Label>
            <Form.Control
              type="text"
              placeholder="Alvarez López..."
              value={info.lastname}
              onChange={recoverLastname}
            />
          </Form.Group>

          <Button type="submit" variant="success" className="mt-1">
            Enviar
          </Button>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
        </>
    )
}