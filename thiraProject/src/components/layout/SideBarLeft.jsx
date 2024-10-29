import React, { useState, useContext, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from "@mui/icons-material/Send";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChatIcon from "@mui/icons-material/Chat";
import AuthContext from "../../context/AuthContext"; // Adjust the path based on your file structure
import { Navigate, useNavigate } from "react-router-dom";
import CreatePost from "../feedpage/CreatePost";
import Login from "../layout/login/Login"; // Import the Login component
import usePosts from "../../hooks/usePost";
import useUser from "../../hooks/useUser";

const SideBarLeft = ({ onLogout }) => {
  const { isAuthenticated, login, username, userId } = useContext(AuthContext);
  const { fetchPosts, addPost } = usePosts();
  const [modalLogin, setModalLogin] = useState(false); // State for login modal
  const [modalLogout, setModalLogout] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { getUserByUsername, getUserById } = useUser();
  const [userProfilePic, setUserProfilePic] = useState("");
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const handleHomeClick = () => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }

    navigate("/");
    window.location.reload();
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }

    navigate("/chat"); // Navigate to the chat list route
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    navigate(`/bookmarks`);
  };

  const handleModalLogout = () => {
    setModalLogout(true);
  };
  const closeModalLogout = () => {
    setModalLogout(false);
  };

  const handleCreatePost = () => {
    if (isAuthenticated) {
      setShowCreatePost(true);
    } else {
      setModalLogin(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth"); // Clear the auth token or flag from localStorage
    if (onLogout) onLogout(); // Notify the parent component
    closeModalLogout(); // Close the modal
    logout();
    window.location.reload(); // Refresh the page
  };

  const NavButton = ({ Icon, label, onClick }) => (
    <div className="relative p-2">
      <Button
        variant="text"
        className="!text-white !capitalize !w-full !gap-4 !justify-start"
        onClick={onClick} // Attach the onClick event handler
      >
        <Icon />
        <span>{label}</span>
      </Button>
    </div>
  );

  const addNewPost = async (newPostContent, newImageContents) => {
    let imageUrls = [];

    if (newImageContents && newImageContents.length > 0) {
      imageUrls = newImageContents; // Store multiple image URLs
    }

    if (!userId) {
      console.error("User ID not found for the current user.");
      return;
    }

    const postDetail = {
      text: newPostContent,
      userId,
      img_urls: imageUrls, // Use the correct field name for multiple images
      createdAt: Timestamp.now(),
    };

    const newPostRef = await addPost(postDetail); // Capture the new post reference

    await fetchPosts();

    const newPost = {
      id: newPostRef.id, // Use the ID from the new post reference
      text: newPostContent,
      img_urls: imageUrls || [],
      likesCount: 0,
      liked: false,
      comments: [],
      commentInput: "",
      username,
      userId,
      profilePic: userProfilePic,
      createdAt: new Date(),
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        const userDoc = await getUserByUsername(username);
        if (userDoc && userDoc.profile_url) {
          setUserProfilePic(userDoc.profile_url);
        } else {
          setUserProfilePic(
            "https://github.com/S707-g/SMD2024/blob/gotinwza/thiraProject/src/components/img/defaultProfile.webp"
          ); // Use default if no profile picture
        }
      }
    };

    fetchUserProfile();
  }, [username, getUserByUsername]);

  return (
    <div className="w-[250px] flex flex-col sticky top-0">
      {/* Top Section */}
      <div>
        <NavButton Icon={HomeIcon} label="Home" onClick={handleHomeClick} />
        <NavButton Icon={PeopleIcon} label="Friends" onClick={() => navigate("/friends")} />
        <NavButton
          Icon={BookmarkIcon}
          label="Bookmarks"
          onClick={handleBookmarkClick}
        />
        <NavButton Icon={SendIcon} label="Post" onClick={handleCreatePost} />
        <NavButton Icon={ChatIcon} label="Chat" onClick={handleChatClick} />
      </div>

      {/* Conditional rendering of the Logout button based on isAuthenticated */}
      {isAuthenticated && (
        <div className="mt-auto">
          <NavButton
            Icon={ExitToAppIcon}
            label="Logout"
            onClick={handleModalLogout}
          />
        </div>
      )}

      {modalLogin && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalLogin(false)} // Corrected this line
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setModalLogin(false)} // Corrected this line
            >
              ✕
            </button>
            <Login
              onSuccess={(user) => {
                login(user.username);
                setModalLogin(false);
              }}
            />
          </div>
        </div>
      )}

      {showCreatePost && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowCreatePost(false)} // Updated to arrow function
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowCreatePost(false)} // Updated to arrow function
            >
              ✕
            </button>
            <CreatePost
              textPostContent={(text, images) => addNewPost(text, images)}
              closePost={() => setShowCreatePost(false)} // Updated to arrow function
            />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {modalLogin && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalLogin(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setModalLogin(false)}
            >
              ✕
            </button>
            <Login
              onSuccess={(user) => {
                login(user.username); // Log the user in
                setModalLogin(false); // Close the login modal
              }}
            />
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {modalLogout && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeModalLogout}
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="contained"
                  className="!bg-red-500 hover:!bg-red-600"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  className="!border-gray-400 !text-gray-400 hover:!border-white hover:!text-white"
                  onClick={closeModalLogout}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBarLeft;
