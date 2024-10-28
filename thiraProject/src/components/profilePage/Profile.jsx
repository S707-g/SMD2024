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
import Feed from "../feedpage/Feed";
import { useUpload } from "../../hooks/useUpload";
import usePosts from "../../hooks/usePost";
const Profile = () => {
  const { username } = useParams();
  const { getUserByUsername, getUserById } = useUser();
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
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const storage = getStorage(); // Initialize Firebase Storage

  const { upload } = useUpload();
  const {fetchPosts} = usePosts();

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

    fetchPosts()
      .then((posts) => {

        if(posts){
          //add user details to posts using getUserById return promise
          const updatedPosts = posts.map(async (post) => {
            const user = await getUserById(post.userId);
            return { ...post, user };
          })
          Promise.all(updatedPosts).then((updatedPosts) => {

            //filter by updatedPost filter by .user.username = username
            const filteredPosts = updatedPosts.filter(
              (post) => post.user.username === username
            );
            setPosts(filteredPosts);

          });
        }
        
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });

    fetchUser();
  }, [username, getUserByUsername]);

  const updateBio = async () => {
    try {
      const userDoc = doc(db, "users", bio.id);
      if(previewImage){
        await updateDoc(userDoc, { profile_url: previewImage});
      }
      await updateDoc(userDoc, { bio: newBio });
      setUserBio(newBio);
      setEditMode(false);
      alert("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    // Debug logging
    console.log('Selected file:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
  
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      alert('Please select an image file');
      return;
    }
  
    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.log('File too large:', file.size);
      alert('Image must be smaller than 5MB');
      return;
    }

    const imgUrl = await upload(file);
  
    console.log('File passed validation');
    setNewImage(file);
    
    // Clean up old preview URL
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    
    const newPreviewUrl = URL.createObjectURL(file);
    console.log('Preview URL created:', imgUrl.data.path);
    setPreviewImage(imgUrl.data.path);
  };
  
  const uploadImage = async () => {
    if (!newImage || !bio.id) return;
    
    try {
      // 1. Create a specific path for the user's profile image
      const storageRef = ref(storage, `users/${bio.id}/profile`);
      
      // 2. Upload the image with metadata
      const metadata = {
        contentType: newImage.type
      };
      
      // 3. Upload file
      const uploadTask = await uploadBytes(storageRef, newImage, metadata);
      console.log('Upload complete');
      
      // 4. Get the download URL immediately after upload
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('File available at:', downloadURL);
  
      // 5. Update Firestore document
      const userDocRef = doc(db, "users", bio.id);
      await updateDoc(userDocRef, {
        profile_url: downloadURL,
        updated_at: Timestamp.now()
      });
  
      // 6. Update local state
      setUserImage(downloadURL);
      setNewImage(null);
      
      // 7. Clean up preview URL
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);
  
      alert("Profile image updated successfully!");
  
    } catch (error) {
      console.error("Upload error:", error);
      
      // Better error messaging
      if (error.code === 'storage/unauthorized') {
        alert("You don't have permission to upload. Please sign in again.");
      } else if (error.code === 'storage/canceled') {
        alert("Upload was cancelled. Please try again.");
      } else if (error.code === 'storage/unknown') {
        alert("An unknown error occurred. Please try again.");
      } else {
        alert("Failed to upload image. Please try again later.");
      }
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
    <div className="text-white w-full h-full pt-3 pr-3 overflow-y-auto">  
      <div className="bg-[#153549] p-5 mb-[30px] border-2 border-white rounded-xl flex-col">
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
            <Typography variant="h5" className="font-semibold text-size-5 ">
              {username}
            </Typography>
            {!editMode ? (
              <Typography variant="body2" color="#cfcfcf" sx={{ mt: 1 }}>
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
                    className="!bg-[#6BADD5] !text-white !rounded-full !py-2 !px-4 !hover:bg-white !hover:text-gray-700"
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

      <div className="mt-3">
        <Typography variant="h5" className="font-semibold text-size-5 text-white">
        {username} 's Post
        </Typography>
      </div>

      <div className="rounded-lg mt-3 h-auto overflow-auto">
          {/* this user posts */}
          <div className="flex flex-col gap-[20px] mb-5">
            {
              posts && posts.map((post) => {
                return (
                  <div key={post.id} className="text-white border-2 p-4 bg-[#203B50] border-white flex flex-col rounded-xl">
                    <div className="flex flex-row">
                      <img src={post.user.profile_url} alt="Profile Picture" className="w-10 h-10 rounded-full mr-5 mb-5" />
                      <span className="font-bold text-[18px]">{post.user.username}</span>
                    </div>
                    <span className="mb-1">{post.text}</span>
                    <div className="flex flex-col gap-5">
                    {post.img_urls && 
                      post.img_urls.map((img) => {
                        return (
                          <img src={img} alt="Post Image" className="w-full h-auto object-cover" />
                        )
                      })
                    }
                    </div>
                  </div>
                )
              })
                
            }
          </div>
      </div>
    </div>
    
  ) : (
    <>T_T GOT CAN'T FIND THIS USER</>
  );
};

export default Profile;
