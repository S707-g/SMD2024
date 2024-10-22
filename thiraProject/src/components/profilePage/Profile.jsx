import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Grid, TextField, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import db from "../../database/FirebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const { username } = useParams();
  const { getUserByUsername } = useUser();
  const [bio, setBio] = useState();
  const [userimage, setUserImage] = useState();
  const [userBio, setUserBio] = useState();
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newImage, setNewImage] = useState(null); // New state to hold the uploaded file
  const [previewImage, setPreviewImage] = useState(""); // Preview before upload

  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUsername(username);
        if (data) {
          setBio(data);
          setUserBio(data.bio);
          setUserImage(data.profile_url);
        } else {
          setBio(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setBio(null);
      }
    };

    fetchUser();
  }, [username, getUserByUsername]);

  const updateBio = async () => {
    try {
      const userDoc = doc(db, "users", bio.id);
      await updateDoc(userDoc, { bio: newBio });
      setUserBio(newBio);
      setEditMode(false);
      alert("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file)); // Preview the uploaded image
  };

  const uploadImage = async () => {
    if (!newImage) return;
    try {
      const imageRef = ref(storage, `profile_images/${bio.id}`); // Store by user ID
      await uploadBytes(imageRef, newImage);
      const url = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "users", bio.id), { profile_url: url });
      setUserImage(url); // Update profile image locally
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (bio === null) {
    return (
      <div className="w-full h-full bg-gray-400 p-3">
        <div className="bg-white p-5 rounded-lg flex-col">
          <Typography variant="h5" color="error">
            T_T Sorry, we couldn't find this user.
          </Typography>
        </div>
      </div>
    );
  }

  const profileImage = previewImage || userimage || 
    "https://github.com/S707-g/SMD2024/blob/gotinwza/thiraProject/src/components/img/defaultProfile.webp";

  return bio ? (
    <div className="w-full h-full bg-gray-400 p-3">
      <div className="bg-white p-5 rounded-lg flex-col">
        <Grid container spacing={3} alignItems="center" className="my-5">
          <Grid item xs={12} sm={4} md={3}>
            <Avatar
              alt={username}
              src={profileImage}
              sx={{ width: 130, height: 130 }}
              className="mt-2 sm:mt-0 mx-auto sm:mx-0"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            )}
          </Grid>

          <Grid item xs={12} sm={8} md={9} className="text-center sm:text-left">
            <Typography variant="h5" className="break-words">
              {username}
            </Typography>
            {!editMode ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userBio || "No bio available."}
              </Typography>
            ) : (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Enter your new bio..."
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2} className="mt-8">
          <Grid item>
            {!editMode ? (
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  setEditMode(true);
                  setNewBio(userBio);
                }}
                className="!bg-gray-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <IconButton
                  onClick={() => {
                    updateBio();
                    uploadImage();
                  }}
                  className="!bg-gray-500 !text-white !hover:bg-blue-700 !ml-[35px]"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  onClick={() => setEditMode(false)}
                  className="!bg-red-500 !text-white !hover:bg-red-700 !ml-[10px]"
                >
                  <CancelIcon />
                </IconButton>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  ) : (
    <>T_T GOT CAN'T FIND THIS USER</>
  );
};

export default Profile;
