import React, { useState, useEffect } from 'react'
import { user } from '../jsApiComponents/user'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function CreatedEvents() {
    const [myActivities, setMyActivities] = useState([])
    const [user_get, setUser_get] = useState(null);
    const navigate = useNavigate()

      const getUser = async () => {
        try {
          const response = await user()
          if (response.ok) {
            setUser_get(response.data.joined)
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
        console.log(myActivities)

    return (
        <div>
            Eventos creados por mi
              <Button onClick={()=> console.log(user_get)} >ver eventos</Button>
        </div>
    )
}

