import React from "react";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from "@mui/icons-material/Send";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

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

const SideBarLeft = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("auth"); // Clear the auth token or flag from localStorage
    if (onLogout) onLogout(); // Notify the parent component
  };

  return (
    <div className="w-[250px] flex flex-col sticky top-0">
      {/* Top Section */}
      <div>
        <NavButton Icon={HomeIcon} label="Home" />
        <NavButton Icon={PeopleIcon} label="Friends" />
        <NavButton Icon={BookmarkIcon} label="Bookmarks" />
        <NavButton Icon={SendIcon} label="Post" />
      </div>

      {/* Logout Button Positioned at the Bottom */}
      <div className="mt-auto">
        <NavButton Icon={ExitToAppIcon} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default SideBarLeft;
