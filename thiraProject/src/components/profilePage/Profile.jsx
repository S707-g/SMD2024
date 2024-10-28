import React, { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Button,
  Typography,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MessageIcon from "@mui/icons-material/Message";
import useUser from "../../hooks/useUser";
import db from "../../database/FirebaseConfig";
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AuthContext from "../../context/AuthContext"; // Assuming AuthContext for user state

const Profile = () => {
  const { username } = useParams();
  const { getUserByUsername } = useUser();
  const {
    user,
    isAuthenticated,
    username: currentUserUsername,
    userId,
  } = useContext(AuthContext); // Get current user's username
  const [bio, setBio] = useState();
  const [userimage, setUserImage] = useState();
  const [userBio, setUserBio] = useState();
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const navigate = useNavigate();
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

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to send a message.");
      return;
    }

    try {
      // Check if chat between the logged-in user and profile user exists
      const chatRef = collection(db, "chats");
      const q = query(chatRef, where("users", "array-contains", userId));
      const querySnapshot = await getDocs(q);

      // Find if chat exists with the selected user
      let existingChat = null;
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.users.includes(bio.id)) {
          existingChat = { id: doc.id, ...chatData };
        }
      });

      // If chat exists, navigate to the chat page
      if (existingChat) {
        navigate(`/chat/${existingChat.id}`);
      } else {
        // If chat doesn't exist, create a new one
        const newChatRef = await addDoc(collection(db, "chats"), {
          users: [userId, bio.id],
          createdAt: Timestamp.now(),
          lastMessage: "",
        });

        // Navigate to the newly created chat
        navigate(`/chat/${newChatRef.id}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send a message. Please try again.");
    }
  };

  const profileImage =
    previewImage ||
    userimage ||
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
              <>
                {/* Only show the "Edit Profile" button if it's the current user's profile */}
                {currentUserUsername === username && (
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
                )}
                {/* Only show the "Send a Message" button if it's not the current user's profile */}
                {currentUserUsername !== username && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    startIcon={<MessageIcon />}
                    className="!bg-blue-500 !text-white !rounded-full !py-2 !px-4 !hover:bg-blue-600 ml-3"
                  >
                    Send a Message
                  </Button>
                )}
              </>
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
