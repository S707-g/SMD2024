import React, { useState, useContext } from "react";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from "@mui/icons-material/Send";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AuthContext from "../../context/AuthContext"; // Adjust the path based on your file structure
import { Navigate, useNavigate } from "react-router-dom";
import Login from "../layout/login/Login";

const SideBarLeft = ({ onLogout }) => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const homeNavigate = useNavigate();

  const handleHomeClick = () => {
    homeNavigate(`/`);
    window.location.reload();
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    homeNavigate(`/bookmarks`);
  };

  const handleModalLogout = () => {
    setModalLogout(true);
  };
  const closeModalLogout = () => {
    setModalLogout(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth"); // Clear the auth token or flag from localStorage
    if (onLogout) onLogout(); // Notify the parent component
    closeModalLogout(); // Close the modal
    logout();
    window.location.reload(); // Refresh the page
  };

  const NavButton = ({ Icon, label, onClick }) => (
    <div className="relative p-2">
      <Button
        variant="text"
        className="!text-white !capitalize !w-full !gap-4 !justify-start"
        onClick={onClick} // Attach the onClick event handler
      >
        <Icon />
        <span>{label}</span>
      </Button>
    </div>
  );

  return (
    <div className="w-[250px] flex flex-col sticky top-0">
      {/* Top Section */}
      <div>
        <NavButton Icon={HomeIcon} label="Home" onClick={handleHomeClick} />
        <NavButton Icon={PeopleIcon} label="Friends" />
        <NavButton
          Icon={BookmarkIcon}
          label="Bookmarks"
          onClick={handleBookmarkClick}
        />
        <NavButton Icon={SendIcon} label="Post" />
      </div>

      {/* Conditional rendering of the Logout button based on isAuthenticated */}
      {isAuthenticated && (
        <div className="mt-auto">
          <NavButton
            Icon={ExitToAppIcon}
            label="Logout"
            onClick={handleModalLogout}
          />
        </div>
      )}

      {modalLogin && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalLogin(false)} // Corrected this line
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setModalLogin(false)} // Corrected this line
            >
              ✕
            </button>
            <Login
              onSuccess={(user) => {
                login(user.username);
                setModalLogin(false);
              }}
            />
          </div>
        </div>
      )}

      {modalLogout && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeModalLogout}
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="contained"
                  className="!bg-red-500 hover:!bg-red-600"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  className="!border-gray-400 !text-gray-400 hover:!border-white hover:!text-white"
                  onClick={closeModalLogout}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBarLeft;
