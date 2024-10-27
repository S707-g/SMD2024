import React from "react";
import { Outlet } from "react-router-dom";
import NavB from "./NavB";
import SideBarLeft from "./SideBarLeft";
import SideBarRight from "./SideBarRight";

const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Navigation Bar */}
      <NavB />

      <div className="flex-grow flex overflow-hidden">
        <div className="flex overflow-auto bg-gray-900 z-10 sticky top-0">
          <SideBarLeft />
        </div>
        {/* Main Content Area */}
        <div className="flex-1  bg-gray-900 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900  ">
          <Outlet />
        </div>

        {/* Right Sidebar */}
        <div className=" bg-gray-900 flex flex-col sticky top-0 h-full">
          <SideBarRight />
        </div>
      </div>
    </div>
  );
};

export default Layout;
