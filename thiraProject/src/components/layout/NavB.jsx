import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Logo from "/src/assets/Thira.svg";
import Login from "./login/Login";
import AuthContext from "../../context/AuthContext";
import useUser from "../../hooks/useUser"; // Import the hook

const NavB = () => {
  const { isAuthenticated, login, username } = useContext(AuthContext);
  const { getUsernamesByPartialMatch } = useUser(); // Use the hook
  const [modalLogin, setModalLogin] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (isAuthenticated && username) {
      navigate(`/profile/${username}`);
    } else {
      setModalLogin(true);
    }
  };

  const handleLogoClick = () => {
    navigate(`/`);
    window.location.reload();
  };

  const closeModalLogin = () => setModalLogin(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setModalLogin(true); // Open login modal if not authenticated
      return;
    }

    if (searchInput.trim()) {
      navigate(`/profile/${searchInput.trim()}`);
      setSearchInput(""); // Clear the search input after navigating
      setMatchingUsers([]); // Clear matching users after search
    }
  };

  useEffect(() => {
    const fetchMatchingUsers = async () => {
      if (!isAuthenticated) {
        setMatchingUsers([]); // Clear if not authenticated
        return;
      }

      if (searchInput.trim().length > 0) {
        const results = await getUsernamesByPartialMatch(searchInput);
        setMatchingUsers(results);
      } else {
        setMatchingUsers([]); // Clear if input is empty
      }
    };

    fetchMatchingUsers();
  }, [searchInput, getUsernamesByPartialMatch, isAuthenticated]);

  return (
    <div className="p-3 flex justify-between items-center bg-gray-800 border-b-2 border-gray-500">
      <div
        className="flex justify-center text-white cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src={Logo} alt="Thira Logo" className="h-12 w-auto" />
      </div>

      <div className="relative flex-grow mx-4 flex justify-center">
        {" "}
        {/* Centered Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-xs"
        >
          {" "}
          {/* Limiting width */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="text-white" aria-label="Search Icon" />
          </div>
          <input
            type="search"
            id="search"
            placeholder="Search profiles"
            className="bg-[#2A3236] pl-10 pr-4 py-2 rounded-full text-white focus:outline-none w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {matchingUsers.length > 0 && (
            <ul className="absolute bg-gray-700 rounded mt-1 w-full z-10 max-h-48 overflow-y-auto">
              {matchingUsers.map((user) => (
                <li
                  key={user.id}
                  className="py-2 px-4 text-white hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setModalLogin(true); // Open login modal if not authenticated
                      return;
                    }
                    navigate(`/profile/${user.username}`);
                    setSearchInput(""); // Clear the input
                    setMatchingUsers([]); // Clear the matches
                  }}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <div className="relative flex gap-3">
        <Button
          variant="text"
          className="!text-white !capitalize !py-2 !px-4 !rounded-full"
          aria-label="Create"
        >
          <AddIcon /> Create
        </Button>

        <Button
          variant="text"
          className="!text-white !rounded-full"
          aria-label="Notifications"
        >
          <NotificationsNoneRoundedIcon />
        </Button>

        <Button
          variant="text"
          className="!text-white !rounded-full"
          aria-label="Account"
          onClick={handleAccountClick}
        >
          <AccountCircleIcon />
        </Button>
      </div>

      {modalLogin && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeModalLogin}
            >
              ✕
            </button>
            <Login
              onSuccess={(user) => {
                login(user.username);
                closeModalLogin();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavB;
