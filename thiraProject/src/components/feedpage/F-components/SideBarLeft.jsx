import React from "react";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";

const SideBarLeft = () => {
  return (
    <div className="flex-col w-[20%] h-full bg-black justify-center ">
      <div className="relative p-2 mt-4 ">
        <Button
          variant="text"
          className="!text-white !capitalize !w-full !gap-2"
        >
          <HomeIcon />
          Home
        </Button>
      </div>
      <div className="relative">
        <Button
          variant="text"
          className="!text-white !capitalize !w-full !gap-2"
        >
          <PeopleIcon />
          Friends
        </Button>
      </div>
    </div>
  );
};

export default SideBarLeft;
