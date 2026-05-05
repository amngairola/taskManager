import { createContext, useContext, useEffect, useState } from "react";
import axios from "./axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/current-user");
        setUser(res.data.data);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Register
  const register = async (formData) => {
    try {
      const res = await axios.post("/register", formData);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // 🔹 Login
  const login = async (formData) => {
    try {
      const res = await axios.post("/login", formData);

      const { accessToken, user } = res.data.data;

      // Save token
      localStorage.setItem("token", accessToken);

      // Set user
      setUser(user);

      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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

// 🔹 Custom hook
export const useAuth = () => useContext(AuthContext);
