import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login"); // Navigate to the LoginPage
  };
  return (
    <header className="flex p-4 z-20 relative">
      <div className="flex-1 text-center ">
        <span className="px-3 py-1 text-blue-700">Thira</span>
      </div>
      <div className="flex-1"></div>

      <button
        className="bg-blue-600 px-5 py-1 rounded-2xl text-white"
        type="botton"
        onClick={handleLogin}
      >
        Sign in
      </button>
    </header>
  );
};

export default Header;
