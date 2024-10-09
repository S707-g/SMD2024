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

        {/* Main Content and Right Sidebar */}
        <div className="flex-grow flex overflow-hidden">
          <div className="flex overflow-auto bg-gray-900 z-10">
            <SideBarLeft />
          </div>
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto bg-gray-900">
            <Outlet />
          </div>

          {/* Right Sidebar */}
          <div className="w-[250px] bg-gray-900 flex flex-col sticky top-0 h-full">
            <SideBarRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
