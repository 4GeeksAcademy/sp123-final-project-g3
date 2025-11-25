const BASE_URL = import.meta.env.VITE_BACKEND_URL
export const login = async (body) => {
  try {
    const response = await fetch(`${BASE_URL}api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);
    console.log(data.access_token);
    localStorage.setItem("JWT-STORAGE-KEY", data.token);
    localStorage.setItem("USER", data.user);
    return {data, status: response.status, "ok": response.ok };
  } catch (error) {
    console.log("Error en login.js", error)
    return {
      "data": null,
      "status": 500,
      "ok": false,
      "error": error.message
    }
  }
}
export const register = async (body) => {
  const response = await fetch(`${BASE_URL}api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json()
    return {data, status: response.status}
  }
export const updateUser = async (body, user) =>{
  const token = localStorage.getItem("JWT-STORAGE-KEY")
  const response = await fetch(`${BASE_URL}api/user/${user}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" ,
    'Authorization': `Bearer ${token}`},
    body: JSON.stringify(body)
  })
  const data = await response.json()
  return {data, status: response.status}
}

export const requestReset = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}api/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
    
};