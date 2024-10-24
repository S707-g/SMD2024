import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for routing
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from "@mui/icons-material/Send";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// Reusable NavButton component with Link
const NavButton = ({ Icon, label, to }) => (
  <div className="relative p-2">
    <Link to={to} className="w-full">
      <Button
        variant="text"
        className="!text-white !capitalize !w-full !gap-4 !justify-start"
      >
        <Icon />
        <span>{label}</span>
      </Button>
    </Link>
  </div>
);

const SideBarLeft = () => {
  return (
    <div className="w-[250px] bg-black flex flex-col sticky top-0">
      {/* Top Section */}
      <div>
        <NavButton Icon={HomeIcon} label="Home" to="/" />
        <NavButton Icon={PeopleIcon} label="Friends" to="/friends" />
        <NavButton Icon={BookmarkIcon} label="Bookmarks" to="/bookmarks" />
        <NavButton Icon={SendIcon} label="Post" to="/post" />
      </div>

      {/* Logout Button Positioned at the Bottom */}
      <div className="mt-auto">
        <NavButton Icon={ExitToAppIcon} label="Logout" to="/login" />
      </div>
    </div>
  );
};

export default SideBarLeft;