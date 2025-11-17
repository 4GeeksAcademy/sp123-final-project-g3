import React, { useEffect, useState } from 'react'
import { user } from '../jsApiComponents/user'
import { useNavigate } from 'react-router-dom'
import HandleError from '../components/HandleError'
export default function User() {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorCode, setErrorCode] = useState(null);
  const nav = useNavigate()


  const handleSubmit = (e) =>{
    e.preventDefault()
  }

  useEffect(() => {
    const infoUser = async () => {
      const data = await user()
      console.log(data)
      if (data.status == 422) {
        alert('Algo ha salido mal!')
        nav('/login')
      }
      if (data.status == 401) {
        alert('Para entrar aqui, debes estar registrado / iniciar sesion!')
        nav('/login')
      }
      setUserInfo(data.data)
      setLoading(false)

    }

    infoUser()
  }, [])
  // Simbolo de carga
  if (loading) return <p>Cargando...

    <button onClick={() => {
      return console.log(errorCode);
    }}>Ver errorCode</button></p>
  // Manejo errores 


  return (
    <div>
      <button onClick={() => {
        return console.log(userInfo)
      }}>ver que trae user</button>
      User
      <div>
{/*         
        <button onClick={() => {
          return nav('/login')
        }}>ir a login</button> */}
      </div>



      <div className="auth-theme">
        <div className="auth-shell">
          <div className="auth-card">
            <div className="auth-title"><h3>Profile</h3></div>
            <div className="auth-title">
            <button onClick={() => {
          return nav('/profile')
        }}>Profile</button>
            <button onClick={() => {
          return nav('/userSaves')
        }}>Actividades Guardadas</button>
            <button onClick={() => {
          return nav('/ajustes')
        }}>Ajustes</button>


            </div>
          </div>
        </div>
      </div>
      );
    </div>

  )
}
