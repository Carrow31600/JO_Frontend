import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(sessionStorage.getItem("refresh"));

  useEffect(() => {
    if (accessToken) {
      fetchUser(accessToken);
    }
  }, []);

  // =========================
  // FETCH AVEC OU SANS AUTH
  // =========================
  async function fetchWithAuth(url, options = {}, requireAuth = false) {
    let token = accessToken;

    // Si on force l'auth et qu'il n'y a pas de token → on essaie de refresh
    if (requireAuth) {
      if (!token && refreshToken) {
        token = await refreshAccessToken();
      }
      if (!token) {
        logout();
        throw new Error("Aucun token disponible pour un appel protégé");
      }
    }

    // Construction des headers
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Si token expiré → tentative de refresh
    if (res.status === 401 && refreshToken) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Impossible de rafraîchir le token");

      const retryRes = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return retryRes;
    }

    return res;
  }

  // =========================
  // RECUPERATION UTILISATEUR
  // =========================
  async function fetchUser(token = accessToken) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  async function refreshAccessToken() {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) {
        logout();
        return null;
      }

      const data = await res.json();
      setAccessToken(data.access);
      sessionStorage.setItem("access", data.access);

      return data.access;
    } catch (error) {
      logout();
      return null;
    }
  }

  // =========================
  // LOGIN
  // =========================
  async function login(username, password) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      sessionStorage.setItem("access", data.access);
      sessionStorage.setItem("refresh", data.refresh);

      await fetchUser(data.access);
      return true;
    } catch (error) {
      console.error("Exception login:", error);
      return false;
    }
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    navigate("/");
  }

  // =========================
  // REGISTER
  // =========================
  async function register(userData) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.ok;
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  async function updateProfile(updates) {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/users/me/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }, true); // ici on force requireAuth = true

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return true;
      } else {
        const errData = await res.json();
        console.error("Erreur updateProfile :", res.status, errData);
        return false;
      }
    } catch (error) {
      console.error("Exception updateProfile :", error);
      return false;
    }
  }

  // =========================
  // DELETE ACCOUNT
  // =========================
  async function deleteAccount() {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/users/me/`, {
        method: "DELETE",
      }, true); // idem requireAuth

      if (res.ok) {
        logout();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    register,
    updateProfile,
    deleteAccount,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
