import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Création d’un contexte pour partager les infos d’authentification  dans toute l'app.
const AuthContext = createContext();

// Hook pour accéder au contexte
export function useAuth() {
  return useContext(AuthContext);
}
// Fournisseur du contexte
export function AuthProvider({ children }) {
  const navigate = useNavigate();


// ******************************************
// Gestion des états
// *****************************************

  const [user, setUser] = useState(null);  // infos sur l'utilisateur connecté
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("access")); // Token 
  const [refreshToken, setRefreshToken] = useState(sessionStorage.getItem("refresh"));  // refresh token

  // à la création du composant, si on a un token, on essai de charger le user
  useEffect(() => {
    if (accessToken) {
      fetchUser(accessToken);
    }
  }, []);


  // **********************************
  // FETCH AVEC OU SANS AUTH
  // **********************************

  async function fetchWithAuth(url, options = {}, requireAuth = false) {
    let token = accessToken;

    // Si un token est requis et qu'il n'y en a pas, on essaie de refresh
    if (requireAuth) {
      if (!token && refreshToken) {
        token = await refreshAccessToken();
      }
      if (!token) {
        logout(); // si pas de token, déconnexion
        throw new Error("Aucun token disponible pour un appel protégé");
      }
    }

    // Construction des headers
    const headers = {
      ...(options.headers || {}),
    };

    // si on a un token, on l'ajoute dans l'entête
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // appel API
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Si token expiré , tentative de refresh
    if (res.status === 401 && refreshToken) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Impossible de rafraîchir le token");

      // appel api avec nouveau token
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

  // ************************************
  // RECUPERATION UTILISATEUR
  // ************************************

  async function fetchUser(token = accessToken) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data); // MAJ état de l'utilisateur
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  }

  // ****************************
  // REFRESH TOKEN
  // ****************************
  async function refreshAccessToken() {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}users/refresh/`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      // Sauvegarde des tokens dans le sessionstorage pour qu'ils soient supprimer si l'utilisateur quitte la session
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

  // *********************************
  // LOGOUT
  // *********************************

  function logout() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    navigate("/");
  }

  // *******************************
  // REGISTER
  // *******************************

  async function register(userData) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.ok;
  }

  // *****************************
  // UPDATE
  // *****************************

  async function updateProfile(updates) {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}users/me/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }, true); //  requireAuth = true, token obligatoire

      if (res.ok) {
        const data = await res.json();
        setUser(data); // MAJ User
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

  // ******************************
  // DELETE
  // ******************************

  async function deleteAccount() {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}users/me/`, {
        method: "DELETE",
      }, true); // Token obligatoire

      if (res.ok) {
        logout(); // déconnection (vide sessionstorage)
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Eléments accessibles dans toute l'app.
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
  
  // Fournit le contexte aux composants enfants
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
