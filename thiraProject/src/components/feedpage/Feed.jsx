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
import AuthContext from "../../context/AuthContext";
import useUser from "../../hooks/useUser";
import usePosts from "../../hooks/usePost";
import useLikes from "../../hooks/useLikes";
import useComments from "../../hooks/useComments";

const Feed = () => {
  const { isAuthenticated, login, username, userId } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [modalLogin, setModalLogin] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(
    "https://github.com/S707-g/SMD2024/blob/gotinwza/thiraProject/src/components/img/defaultProfile.webp"
  );
  const [moreOptionsVisible, setMoreOptionsVisible] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(null);
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { getUserByUsername, getUserById } = useUser();
  const { addPost, fetchPosts, deletePost } = usePosts();
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
    // Implement edit functionality
    console.log(`Edit post at index: ${index}`);
  };

  const handleDeletePost = async (index) => {
    if (!isAuthenticated) {
      setModalLogin(true);
      return;
    }
    const post = posts[index];
    try {
      // Delete likes associated with the post
      await deleteLikesForPost(post.id);
      // Delete comments associated with the post
      await deleteCommentsForPost(post.id);
      // Delete the post itself
      await deletePost(post.id);
      // Remove the post from the posts array
      const updatedPosts = [...posts];
      updatedPosts.splice(index, 1);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  const handleHidePost = (index) => {
    // Implement hide functionality
    console.log(`Hide post at index: ${index}`);
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
        const data = await fetchPosts();
        if (data && data?.length > 0) {
          const postPromises = data.map(async (post) => {
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

  const addNewPost = async (newPostContent, newImageContent) => {
    let imageUrl = null;

    if (newImageContent) {
      imageUrl = newImageContent;
    }

    if (!userId) {
      console.error("User ID not found for the current user.");
      return;
    }

    const postDetail = {
      text: newPostContent,
      userId,
      img_url: imageUrl,
      createdAt: Timestamp.now(),
    };

    const newPostRef = await addPost(postDetail); // Capture the new post reference

    const newPost = {
      id: newPostRef.id, // Use the ID from the new post reference
      text: newPostContent,
      img_url: imageUrl || "",
      likesCount: 0,
      liked: false,
      comments: [],
      commentInput: "",
      username,
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
                  {/* More options */}
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
                          <li
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                            onClick={() => handleEditPost(index)}
                          >
                            Edit Post
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                            onClick={() => handleHidePost(index)}
                          >
                            Hide Post
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                            onClick={() => handleDeletePost(index)}
                          >
                            Delete Post
                          </li>
                          {/* Other menu items */}
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
                {post.img_url && (
                  <div className="mb-4">
                    <img
                      src={post.img_url}
                      alt="Post"
                      className="w-full max-w-full h-auto max-h-96 object-contain"
                    />
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
              textPostContent={(text, image) => addNewPost(text, image)}
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
    </div>
  );
};

export default Feed;
