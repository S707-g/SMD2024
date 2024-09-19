import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";

const NavB = () => {
  return (
    <div className="p-3 flex justify-between bg-black ">
      <div className="text-white text-2xl font-bold  ml-4">THIRA/Y</div>

      {/* Search input with icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="text-white" />
        </div>
        <input
          type="search"
          id="search"
          placeholder="Search"
          className="bg-[#2A3236] pl-10 px-10 py-2 rounded-full text-white focus:outline-none"
        />
      </div>

      <div className="relative">
        <Button
          variant="text"
          className="!text-white !capitalize !py-2 !px-4 !rounded-full"
        >
          <AddIcon />
          Create
        </Button>
        <Button
          variant="text"
          className="!text-white !rounded-full"
        >
          <AccountCircleIcon />
        </Button>
      </div>
    </div>
  );
};

export default NavB;
