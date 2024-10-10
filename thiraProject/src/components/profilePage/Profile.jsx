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
  const [url, setUrl] = useState();

  useEffect(() => {
    getUserByUsername(username).then((data) => setBio(data));
  }, [username]);

  useEffect(()=>{
    // Create a new URL object
    const url = new URL(window.location.href );

    // Get the base URL
    const baseUrl = url.origin;

    setUrl(baseUrl)

  },[])

  return (
    bio && bio.profile_url.length > 1 ?
    <div className="w-full h-full bg-gray-400 p-3">
      {/* Header Section */}
      <div className="bg-white p-5 rounded-lg flex-col ">
        <div className="flex flex-col sm:flex-row items-center my-5">
          {/* Profile Picture */}
          <div className="px-3">
            <Avatar 
            alt={username} 
            src={bio.profile_url} 
            sx={{ width: 130, height: 130 }}
            className="mt-2 sm:mt-0 mx-auto sm:mx-0"
            />
          </div>

          {/* Name and Username */}
          <div className="mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left">
            <Typography variant="h5">{username}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Password: {bio.password}
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
    :
    <>
      T_T GOT CANT FIND THIS USER
    </>
  );
};

export default Profile;
