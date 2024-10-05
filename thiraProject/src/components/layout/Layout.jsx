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

      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[250px] bg-gray-100 flex overflow-auto">
          <SideBarLeft />
        </div>

        {/* Main Content and Right Sidebar */}
        <div className="flex-grow flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-grow overflow-auto">
            <Outlet />
          </div>

          {/* Right Sidebar */}
          <div className="w-[250px] bg-black flex flex-col sticky top-0 h-full">
            <SideBarRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
