import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Grid } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";

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
        <Grid container spacing={3} alignItems="center" className="my-5">
          {/* Profile Picture */}
          <Grid item xs={12} sm={4} md={3}>
            <Avatar
              src="src/components/img/blank-profile-picture-973460_1280.webp"
              alt=""
              sx={{ width: { xs: 100, sm: 130 }, height: { xs: 100, sm: 130 } }}
              className="mt-2 sm:mt-0 mx-auto sm:mx-0"
            />
          </Grid>

          {/* Name and Username */}
          <Grid item xs={12} sm={8} md={9} className="text-center sm:text-left">
            <Typography variant="h5" className="break-words">
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Password: {bio?.password}
            </Typography>
          </Grid>
        </Grid>

        {/* Navigation Menu */}
        <Grid container spacing={2} justifyContent="" className="mt-8">
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
            >
              Like
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
            >
              Post
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
            >
              Follower
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<SettingsIcon />}
              className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !flex !items-center !hover:bg-white !hover:text-gray-700"
            >
              Settings
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Profile;
