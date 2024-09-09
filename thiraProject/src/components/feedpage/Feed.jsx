import React from "react";
import Tweet from "./F-components/Tweet";
import NavB from "./F-components/NavB";
import SideBarLeft from "./F-components/SideBarLeft";
import SideBarRight from "./F-components/SideBarRight";

const Feed = () => {
  return (
    <body className="flex-col min-h-screen">
      <NavB />
      <div className="flex h-screen divide-x-2 divide-blue-700">
        <SideBarLeft />
        <Tweet />
        kijuhyyg
        <SideBarRight/>
      </div>
    </body>
  );
};
export default Feed;
