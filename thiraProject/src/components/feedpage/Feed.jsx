import React, { useState, useContext, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import MoonLoader from "react-spinners/MoonLoader";
import { Timestamp } from "firebase/firestore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { formatDistanceToNow } from "date-fns";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CreatePost from "./CreatePost";
import ModalPost from "./ModalPost";
import Login from "../layout/login/Login";
import EditPost from "./Editpost";
import AuthContext from "../../context/AuthContext";
import useUser from "../../hooks/useUser";
import usePosts from "../../hooks/usePost";
import useLikes from "../../hooks/useLikes";
import useComments from "../../hooks/useComments";
import useHiddenPosts from "../../hooks/useHiddenPosts";

const Feed = () => {
  const { isAuthenticated, login, username, userId } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [modalLogin, setModalLogin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(
    "https://github.com/S707-g/SMD2024/blob/gotinwza/thiraProject/src/components/img/defaultProfile.webp"
  );
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(null);
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { getUserByUsername, getUserById } = useUser();
  const { addPost, fetchPosts, deletePost, updatePost } = usePosts();
  const { addPostToHiddenPosts, getHiddenPosts } = useHiddenPosts();
  const {
    isPostLikedByUser,
    likePost,
    unlikePost,
    getLikesCount,
    deleteLikesForPost,
  } = useLikes();
  const { addComment, fetchCommentsForPost, deleteCommentsForPost } =
    useComments();

  const handleCreatePost = () => {
    if (isAuthenticated) {
      setShowCreatePost(true);
    } else {
      setModalLogin(true);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url); // Set the selected image URL
  };

  // Function to close the modal
  const closeImageModal = () => {
    setSelectedImage(null); // Clear the selected image
  };

  const closeCreatePost = () => setShowCreatePost(false);
  const closeModalLogin = () => setModalLogin(false);
  const closeModalPost = () => {
    setShowModalPost(false);
    setCurrentPostIndex(null);
  };

  const showCommentPost = (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    const post = posts[index];
    if (post.comments.length >= 3) {
      // For posts with 3 or more comments, open the modal
      setCurrentPostIndex(index);
      setShowModalPost(true);
    } else {
      // For posts with 2 or fewer comments, toggle inline comments
      setCommentsVisibility((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const handleLikedToggle = async (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }

    const updatedPosts = [...posts];
    const post = updatedPosts[index];

    if (!userId) {
      console.error("User ID not found for the current user.");
      return;
    }

    if (post.liked) {
      // Unlike the post
      await unlikePost(post.id, userId);
      post.likesCount -= 1;
      post.liked = false;
    } else {
      // Like the post
      await likePost(post.id, userId);
      post.likesCount += 1;
      post.liked = true;
    }

    setPosts(updatedPosts);
  };

  const handleComment = async (index, commentText) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    if (commentText) {
      const updatedPosts = [...posts];
      const post = updatedPosts[index];

      // Add comment to Firestore
      await addComment(post.id, userId, commentText);

      // Fetch updated comments
      const updatedComments = await fetchCommentsForPost(post.id);
      post.comments = updatedComments || [];
      post.commentInput = "";

      setPosts(updatedPosts);
    }
  };

  const toggleMoreOptions = (index) => {
    setMoreOptionsVisible((prev) => {
      const newVisible = { [index]: !prev[index] };
      return newVisible;
    });
  };

  const handleEditPost = (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    const post = posts[index];
    setPostToEdit({ ...post, index });
    setShowEditPostModal(true);
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      // Update the post in Firestore
      await updatePost(updatedPost.id, {
        text: updatedPost.text,
        img_urls: updatedPost.img_urls, // Changed to img_urls
      });

      // Update the local state
      const updatedPosts = [...posts];
      updatedPosts[updatedPost.index] = {
        ...updatedPosts[updatedPost.index],
        text: updatedPost.text,
        img_urls: updatedPost.img_urls, // Changed to img_urls
      };

      setPosts(updatedPosts);
      setShowEditPostModal(false);
      setPostToEdit(null);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  const handleDeletePost = async (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    const post = posts[index];
    try {
      await deleteLikesForPost(post.id);
      await deleteCommentsForPost(post.id);
      await addPostToHiddenPosts(userId, post.id, true);
      await deletePost(post.id);

      const updatedPosts = [...posts];
      updatedPosts.splice(index, 1);
      setPosts(updatedPosts);

      // Close the more options menu after deletion
      setMoreOptionsVisible((prev) => ({
        ...prev,
        [index]: false,
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  const handleHidePost = async (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }

    const post = posts[index];

    try {
      // Add post ID to the user's hidden posts in the database
      await addPostToHiddenPosts(userId, post.id);

      // Remove the post from the posts array
      const updatedPosts = posts.filter((_, i) => i !== index);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error hiding post:", error);
      alert("An error occurred while hiding the post.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside the options menu, close the menu
      if (!event.target.closest(".options-container")) {
        setMoreOptionsVisible({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    if (isLoaded) return;

    const loadPosts = async () => {
      try {
        let hiddenPosts = [];
        if (isAuthenticated && userId) {
          hiddenPosts = await getHiddenPosts(userId);
        }

        const data = await fetchPosts();
        if (data && data?.length > 0) {
          const postPromises = data
            .filter((post) => !hiddenPosts.includes(post.id)) // Exclude hidden posts
            .map(async (post) => {
              const postData = { ...post };

              // Fetch user data
              if (post.userId) {
                const user = await getUserById(post.userId);
                postData.username = user?.username || "Unknown User";
                postData.profilePic = user?.profile_url || "/profile.webp";
              } else {
                postData.username = "Unknown User";
                postData.profilePic = "/profile.webp";
              }

              // Fetch likes count and if the current user has liked the post
              const likesCountPromise = getLikesCount(post.id);
              const likedPromise =
                isAuthenticated && userId
                  ? isPostLikedByUser(post.id, userId)
                  : false;

              const [likesCount, liked] = await Promise.all([
                likesCountPromise,
                likedPromise,
              ]);
              postData.likesCount = likesCount;
              postData.liked = liked;

              // Fetch comments for the post
              const comments = await fetchCommentsForPost(post.id);
              postData.comments = comments || [];

              // Convert Firestore Timestamp to JavaScript Date
              postData.createdAt = post.createdAt?.toDate;
              if (post.createdAt && post.createdAt.toDate) {
                // Firestore Timestamp object
                postData.createdAt = post.createdAt.toDate();
              } else if (post.createdAt) {
                // Already a Date object or ISO string
                postData.createdAt = new Date(post.createdAt);
              } else {
                // Fallback to current date or handle missing date
                postData.createdAt = new Date();
              }

              // Initialize and commentInput
              postData.commentInput = "";

              return postData;
            });

          const postsData = await Promise.all(postPromises);
          setPosts(postsData);
          setIsLoaded(true);
        } else {
          console.error("No posts found");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPosts();
  }, [isLoaded, isAuthenticated, userId, fetchPosts, getUserById]);

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

  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-row p-3 items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            if (isAuthenticated) {
              // Redirect to the profile page if authenticated
              window.location.href = `/profile/${username}`;
            } else {
              // Show login modal if not authenticated
              setModalLogin(true);
            }
          }}
        >
          <img
            src={userProfilePic}
            alt={`${username}'s profile`}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="mx-4">{username || ""}</div>
        </div>

        <Button
          onClick={handleCreatePost}
          className="!rounded-2xl flex-1 !bg-gray-700 !text-white !text-start hover:!bg-gray-600"
        >
          Post Here
        </Button>
      </div>

      <div className="flex flex-col max-w-full gap-5 ">
        {posts?.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800"
              style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            >
              <div className="flex flex-col">
                {/* Post Header */}
                <div className="flex items-center mb-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      if (isAuthenticated) {
                        // Redirect to the profile page if authenticated
                        window.location.href = `/profile/${post.username}`;
                      } else {
                        // Show login modal if not authenticated
                        setModalLogin(true);
                      }
                    }}
                  >
                    <img
                      src={post.profilePic}
                      alt={`${post.username}'s profile`}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div className="flex flex-col">
                      <div className="text-lg font-semibold">
                        {post.username}
                      </div>
                      <div className="text-sm text-gray-400">
                        {post.createdAt
                          ? formatDistanceToNow(post.createdAt, {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </div>
                    </div>
                  </div>

                  <div className="relative options-container ml-auto">
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMoreOptions(index);
                      }}
                    >
                      <MoreHorizIcon />
                    </div>
                    {moreOptionsVisible[index] && (
                      <div className="absolute right-0 p-2 w-48 bg-gray-700 rounded-md shadow-xl">
                        {/* Menu items */}
                        <ul className="py-1">
                          {userId === post.userId && (
                            <>
                              <li
                                className="px-4 py-2 hover:bg-gray-500 cursor-pointer rounded-2xl"
                                onClick={() => handleEditPost(index)}
                              >
                                Edit Post
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-gray-500 cursor-pointer rounded-2xl"
                                onClick={() => handleDeletePost(index)}
                              >
                                Delete Post
                              </li>
                            </>
                          )}
                          <li
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer rounded-2xl"
                            onClick={() => handleHidePost(index)}
                          >
                            Hide Post
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4 break-words flex">
                  <div className="p-2">{post.text}</div>
                </div>

                {/* Post Image */}
                {post.img_urls && post.img_urls.length > 0 && (
                  <div
                    className={`mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track max-w-full flex gap-2 ${
                      post.img_urls.length === 1
                        ? "justify-center" // Center the single image
                        : "justify-start" // Align multiple images to the start
                    }`}
                  >
                    {post.img_urls.map((url, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`Post Image ${imgIndex + 1}`}
                        className={`mb-4 object-cover rounded-md cursor-pointer ${
                          post.img_urls.length === 1
                            ? "w-full max-w-[800px] h-[500px]" // Full width for single image with max-width limit
                            : post.img_urls.length === 2
                            ? "flex-1 max-w-[400px] h-auto" // Flex for two images with a max-width limit
                            : "flex-1 max-w-[300px] h-auto" // Flex for three or more, with smaller max-width
                        }`}
                        onClick={() => handleImageClick(url)}
                      />
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="border-t-2 border-gray-500 p-2 pt-4">
                  <div className="flex space-x-4 items-end justify-between pb-2">
                    <div className="flex flex-row gap-3">
                      {post.likesCount > 0 && (
                        <span className="items-end flex">
                          {post.likesCount}{" "}
                          {post.likesCount === 1 ? "like" : "likes"}
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => showCommentPost(index)}
                      className="cursor-pointer"
                    >
                      {post.comments.length > 0 && (
                        <div>
                          {post.comments.length}{" "}
                          {post.comments.length === 1 ? "comment" : "comments"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-10">
                    <div
                      onClick={() => handleLikedToggle(index)}
                      className="cursor-pointer hover:text-gray-600 flex items-end"
                    >
                      {post.liked ? (
                        <FavoriteIcon className="text-red-600" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </div>
                    <button onClick={() => showCommentPost(index)}>
                      <div className="gap-3 flex hover:text-gray-500">
                        Comment
                        <ChatBubbleOutlineIcon />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {commentsVisibility[index] && post.comments?.length <= 2 && (
                  <div className="flex flex-col gap-3 mt-4 border-t-2 border-gray-600 pt-4">
                    {Array.isArray(post.comments) &&
                      post.comments
                        .slice()
                        .reverse()
                        .map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-700 p-2 rounded-lg mt-2 flex items-start"
                          >
                            {/* User Profile Picture */}
                            <img
                              src={comment.profilePic || "/defaultProfile.webp"}
                              alt={`${comment.username}'s profile`}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              {/* Username and Timestamp */}
                              <div className="flex items-center">
                                <div className="font-semibold mr-2">
                                  {comment.username}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {comment.createdAt instanceof Date &&
                                  !isNaN(comment.createdAt)
                                    ? formatDistanceToNow(comment.createdAt, {
                                        addSuffix: true,
                                      })
                                    : "Just now"}
                                </div>
                              </div>
                              {/* Comment Text */}
                              <div className="text-sm py-1 break-words">
                                {comment.text}
                              </div>
                            </div>
                          </div>
                        ))}
                    <div className="flex flex-row gap-3 mt-2">
                      <div
                        className="flex  cursor-pointer"
                        onClick={() => {
                          if (isAuthenticated) {
                            // Redirect to the profile page if authenticated
                            window.location.href = `/profile/${username}`;
                          } else {
                            // Show login modal if not authenticated
                            setModalLogin(true);
                          }
                        }}
                      >
                        <img
                          src={userProfilePic}
                          alt={`${username}'s profile`}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                      </div>
                      <div className="flex-1 ">
                        <TextField
                          placeholder="Write a comment..."
                          variant="outlined"
                          className="!bg-gray-700 !rounded-xl"
                          value={post.commentInput}
                          maxRows={6}
                          fullWidth
                          multiline
                          onChange={(e) => {
                            const updatedPosts = [...posts];
                            updatedPosts[index].commentInput = e.target.value;
                            setPosts(updatedPosts);
                          }}
                          sx={{
                            "& .MuiInputBase-root": { color: "white" },
                            "& .MuiInputLabel-root": { color: "gray" },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "white",
                            },
                            "& .MuiInput-underline:before": {
                              borderBottomColor: "white",
                            },
                            "& .MuiInput-underline:hover:before": {
                              borderBottomColor: "white",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottomColor: "white",
                            },
                          }}
                        />
                      </div>
                      <div className="text-end pt-3">
                        <SendIcon
                          onClick={() =>
                            handleComment(index, post.commentInput)
                          }
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center h-full items-center mt-10 pt-44">
            <MoonLoader color="#ffffff" size={100} />
          </div>
        )}
      </div>

      {showCreatePost && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeCreatePost}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeCreatePost}
            >
              ✕
            </button>
            <CreatePost
              textPostContent={(text, images) => addNewPost(text, images)}
              closePost={closeCreatePost}
            />
          </div>
        </div>
      )}

      {modalLogin && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModalLogin}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeModalLogin}
            >
              ✕
            </button>
            <Login
              onSuccess={(user) => {
                login(user.username);
                closeModalLogin();
                setShowCreatePost(true);
              }}
            />
          </div>
        </div>
      )}

      {showModalPost && currentPostIndex !== null && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModalPost}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeModalPost}
            >
              ✕
            </button>
            <ModalPost
              post={posts[currentPostIndex]}
              handleComment={(commentText) =>
                handleComment(currentPostIndex, commentText)
              }
            />
          </div>
        </div>
      )}

      {showEditPostModal && postToEdit && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowEditPostModal(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowEditPostModal(false)}
            >
              ✕
            </button>
            <EditPost
              post={postToEdit}
              onUpdate={handleUpdatePost}
              onClose={() => setShowEditPostModal(false)}
            />
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeImageModal} // Close modal on click
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeImageModal} // Close button for modal
            >
              ✕
            </button>
            {/* Full-size image with max dimensions to fit the screen */}
            <img
              src={selectedImage}
              alt="Full-size"
              className="max-w-full max-h-full object-contain" // Ensures the image fits within the viewport
              style={{ maxWidth: "90vw", maxHeight: "90vh" }} // Limits the image size to 90% of the viewport
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
