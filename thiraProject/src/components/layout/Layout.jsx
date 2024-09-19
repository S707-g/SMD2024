import React from "react";
import { Outlet } from "react-router-dom";
import NavB from "../feedpage/F-components/NavB";
import SideBarLeft from "../feedpage/F-components/SideBarLeft";
import SideBarRight from "../feedpage/F-components/SideBarRight";

const Layout = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <NavB />
      <div className="flex-grow flex overflow-auto">
        <SideBarLeft />
        <div className="flex-grow flex overflow-auto h-full">
          <div className="flex-grow  h-full">
            <Outlet/>
          </div>
          <div className="w-[250px] bg-black flex flex-col sticky top-0">
            <SideBarRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;  
