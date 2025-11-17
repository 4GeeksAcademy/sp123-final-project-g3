export const user = async () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("JWT-STORAGE-KEY");
  try {
    const response = await fetch(`${BASE_URL}api/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.log("Error en user.js", error);
    return {
      data: null,
      status: 500,
      ok: false,
      error: error.message,
    };
  }
};
