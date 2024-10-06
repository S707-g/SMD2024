import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Logo from "/src/assets/Thira.svg";

const NavB = () => {
  return (
    <div className="p-3 flex justify-between bg-gray-800 border-b-2 border-gray-500">
      <div className="flex justify-center text white">
        <img src={Logo} alt="Thira" className="h-12 w-auto" />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="text-white" />
        </div>
        <input
          type="search"
          id="search"
          placeholder="Search"
          className="bg-[#2A3236] pl-20 px-10 py-2 rounded-full text-white focus:outline-none"
        />
      </div>

      <div className="relative">
        <Button
          variant="text"
          className="!text-white !capitalize !py-2 !px-4 !rounded-full"
        >
          <AddIcon /> Create
        </Button>

        <Button variant="text" className="!text-white !rounded-full">
          <NotificationsNoneRoundedIcon />
        </Button>

        <Button variant="text" className="!text-white !rounded-full">
          <AccountCircleIcon />
        </Button>
      </div>
    </div>
  );
};

export default NavB;
