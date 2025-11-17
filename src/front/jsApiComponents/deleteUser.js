const BASE_URL = import.meta.env.VITE_BACKEND_URL
const userID = localStorage.getItem('USER')
export const deleteUser = async (body) => {
  try {

    const response = await fetch(`${BASE_URL}api/user/${userID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    const data = await response.json();
    
    
    return console.log(data)
  } catch (error) {
    console.log(error)
  }
}