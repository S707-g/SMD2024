import React, { createContext, useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import { useNavigation } from "./NavigationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getUserByUsername } = useUser();
  const { navigate } = useNavigation(); // Use navigate from NavigationContext

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = localStorage.getItem("username");
    const id = localStorage.getItem("userId");

    setIsAuthenticated(!!auth);
    if (user) setUsername(user);
    if (id) setUserId(id);

    setLoading(false);
  }, []);

  const login = async (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    localStorage.setItem("auth", "true");
    localStorage.setItem("username", user);

    try {
      const userDoc = await getUserByUsername(user);
      const id = userDoc ? userDoc.id : null;
      if (id) {
        setUserId(id);
        localStorage.setItem("userId", id);
      } else {
        console.error("User ID not found for username:", user);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/"); // Use navigate from NavigationContext
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, username, userId, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
