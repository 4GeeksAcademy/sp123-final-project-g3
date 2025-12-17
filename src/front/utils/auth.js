export function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    const padded = payload + (pad ? "=".repeat(4 - pad) : "");
    const decoded = atob(padded);

    const json = decodeURIComponent(
      Array.prototype.map
        .call(
          decoded,
          (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function isTokenValid(token) {
  return !!token && !isTokenExpired(token);
}

export function setToken(token) {
  sessionStorage.setItem("token", token);
}
export function getToken() {
  return sessionStorage.getItem("token");
}

export function removeToken() {
  sessionStorage.removeItem("token");
}

export function setRefreshToken(token) {
  sessionStorage.setItem("refresh_token", token);
}

export function getRefreshToken() {
  return sessionStorage.getItem("refresh_token");
}

export function removeRefreshToken() {
  sessionStorage.removeItem("refresh_token");
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`/api/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      return data.token;
    }
    return null;
  } catch (e) {
    return null;
  }
}
