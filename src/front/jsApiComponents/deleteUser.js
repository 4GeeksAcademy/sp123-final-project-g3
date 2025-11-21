const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const deleteUser = async () => {
  const user = localStorage.getItem("USER");
  const token = localStorage.getItem("JWT-STORAGE-KEY");
  try {
    const response = await fetch(`${BASE_URL}api/user/${user}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) return {'msg': "Usuario Eliminado"}
    
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
