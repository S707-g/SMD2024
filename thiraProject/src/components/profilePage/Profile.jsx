import React from "react";

// Profile Component
const Profile = () => {
  return (
    <div className="w-full h-full bg-gray-400">
      {/* Header Section */}
      <div className="bg-white h-auto sm:h-[200px] w-full p-5 sm:p-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {/* Profile Picture */}
          <img src="src/components/img/blank-profile-picture-973460_1280.webp" className="h-[90px] w-[90px] sm:w-auto rounded-full mt-[20px] sm:ml-[80px]" alt=""/>
          {/* Name and Username */}
        <div className="sm:ml-[20px] text-center sm:text-left mt-[20px] sm:mt-[30px]">
          <div className="text-[20px]">Name</div>
          <div className="text-[10px] mt-[5px] sm:mt-[10px]">User Name</div>
        </div>
      </div>
 
        {/* Navigation Menu */}
        <div className="p-5 flex flex-row mt-[25px] mb-0 bg-gray-300">
          <ul className="flex flex-col sm:flex-row ml-[8%] mr-[8%] text-white justify-between w-full">
            <li className="cursor-pointer h-[40px] w-full sm:w-[90px] mb-2 sm:mb-0 rounded-[25px] flex items-center justify-center text-center bg-gray-500 hover:bg-white hover:text-gray-700">
              <a href="#">Like</a>
            </li>
            <li className="cursor-pointer h-[40px] w-full sm:w-[90px] mb-2 sm:mb-0 rounded-[25px] flex items-center justify-center text-center bg-gray-500 hover:bg-white hover:text-gray-700">
              <a href="#">Post</a>
            </li>
            <li className="cursor-pointer h-[40px] w-full sm:w-[90px] mb-2 sm:mb-0 rounded-[25px] flex items-center justify-center text-center bg-gray-500 hover:bg-white hover:text-gray-700">
              <a href="#">Follower</a>
            </li>
            <li className="cursor-pointer h-[40px] w-full sm:w-[90px] rounded-[25px] flex items-center justify-center text-center bg-gray-500 hover:bg-white hover:text-gray-700">
              <a href="#">
                <img src="src/components/img/gear-1119298_640.webp" alt="Settings" className="inline-block h-[20px] w-[20px] mr-1"/>Setting</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;



