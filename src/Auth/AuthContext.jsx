import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, navigate }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(sessionStorage.getItem("refresh"));

  

  useEffect(() => {
    if (accessToken) {
      fetchUser(accessToken);
    }
  }, []);

  // =========================
  // RECUPERATION DE l'UTILISATEUR
  // =========================
  async function fetchUser(token = accessToken) {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401 && refreshToken) {
        await refreshAccessToken();
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
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      setAccessToken(data.access);
      sessionStorage.setItem("access", data.access);

      await fetchUser(data.access);
    } catch (error) {
      logout();
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
     if (navigate) navigate('/');
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
  if (!accessToken && refreshToken) {
    // on demande un nouveau token si celui en stock est expiré
    await refreshAccessToken();
  }

  if (!accessToken) {
    console.error("Aucun token disponible pour mettre à jour le profil.");
    return false;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return true;
    } else if (res.status === 401 && refreshToken) {

      await refreshAccessToken();
      return await updateProfile(updates);
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      logout();
      return true;
    }
    return false;
  }

  const value = {
    user,
    accessToken,
    login,
    logout,
    register,
    updateProfile,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
