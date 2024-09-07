import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    const handleLogin = () => {
      navigate("/login"); // Navigate to the LoginPage
    };
  return (
    <header className="flex p-4 ">
      <div className="flex-1 text-center ">
        <span className="px-3 py-1 ">Thira</span>
      </div>
      <div className="flex-1"></div>
      <div className="">
        <button
          className="bg-blue-400 px-3 py-1 rounded-2xl"
          type="botton"
          onClick={handleLogin}
        >
          Sign in
        </button>
      </div>
    </header>
  );
};

export default Header;
