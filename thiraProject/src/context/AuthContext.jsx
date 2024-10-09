import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = localStorage.getItem("username");
    setIsAuthenticated(!!auth);
    if (user) setUsername(user);
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    localStorage.setItem("auth", "true");
    localStorage.setItem("username", user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    navigate("/"); // Use navigate to redirect to the homepage on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
