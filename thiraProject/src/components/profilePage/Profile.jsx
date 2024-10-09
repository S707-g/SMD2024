import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";

// Profile Component
const Profile = () => {
  const { username } = useParams();
  const { getUserByUsername } = useUser();
  const [bio, setBio] = useState();

  useEffect(() => {
    getUserByUsername(username).then((data) => setBio(data));
  }, [username, getUserByUsername]);

  return (
    <div className="w-full h-full bg-gray-400 p-3">
      {/* Header Section */}
      <div className="bg-white p-5 rounded-lg flex-col ">
        <div className="flex flex-col sm:flex-row items-center my-5">
          {/* Profile Picture */}
          <div className="px-3">
            <Avatar
              src="src/components/img/blank-profile-picture-973460_1280.webp"
              alt=""
              sx={{ width: 130, height: 130 }}
              className="mt-2 sm:mt-0 mx-auto sm:mx-0"
            />
          </div>

          {/* Name and Username */}
          <div className="mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left">
            <Typography variant="h5">{username}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Password: {bio?.password}
            </Typography>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex justify-start p-2 mt-8 rounded-md gap-6">
          <Button
            variant="contained"
            color="inherit"
            className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
          >
            Like
          </Button>
          <Button
            variant="contained"
            color="inherit"
            className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
          >
            Post
          </Button>
          <Button
            variant="contained"
            color="inherit"
            className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
          >
            Follower
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<SettingsIcon />}
            className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !flex !items-center !hover:bg-white !hover:text-gray-700"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
