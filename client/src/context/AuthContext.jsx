import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/current-user");
        setUser(res.data.data);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register
  const register = async (formData) => {
    try {
      const res = await api.post("/register", formData);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const res = await api.post("/login", formData);

      const { user } = res.data.data;

      setUser(user);

      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
