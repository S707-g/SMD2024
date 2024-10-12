import React, { createContext, useState, useEffect } from "react";
import useUser from "../hooks/useUser"; // Import useUser to use getUserByUsername

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId to state

  const { getUserByUsername } = useUser();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = localStorage.getItem("username");
    const id = localStorage.getItem("userId");
    setIsAuthenticated(!!auth);
    if (user) setUsername(user);
    if (id) setUserId(id);
  }, []);

  const login = async (user) => {
    setIsAuthenticated(true);
    setUsername(user);

    // Retrieve userId from database
    const userDoc = await getUserByUsername(user);
    const id = userDoc ? userDoc.id : null;
    if (id) {
      setUserId(id);
      localStorage.setItem("userId", id);
    } else {
      console.error("User ID not found for username:", user);
    }

    localStorage.setItem("auth", "true");
    localStorage.setItem("username", user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/"); // Use navigate to redirect to the homepage on logout
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, username, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
