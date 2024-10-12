import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, TextField } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CreatePost from "./CreatePost";
import ModalPost from "./ModalPost";
import Login from "../layout/login/Login";
import AuthContext from "../../context/AuthContext";
import useUser from "../../hooks/useUser";
import usePosts from "../../hooks/usePost";

const Feed = () => {
  const { isAuthenticated, login, username } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [textPostContent, setTextPostContent] = useState([]);
  const [imagePostContent, setImagePostContent] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState([]);
  const [likesCount, setLikesCount] = useState([]);
  const [liked, setLiked] = useState([]);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState({});
  const [currentPostIndex, setCurrentPostIndex] = useState(null);
  const [commentVisibility, setCommentVisibility] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postUsernames, setPostUsernames] = useState([]); // State for usernames per post

  const { getUserByUsername, getUserById } = useUser();
  const { addPost, fetchPosts } = usePosts();

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
    if (comments[index]?.length > 1) {
      setCurrentPostIndex(index);
      setShowModalPost(true);
    } else {
      setCommentVisibility((prevVisibility) => {
        const updatedVisibility = [...prevVisibility];
        updatedVisibility[index] = !updatedVisibility[index];
        return updatedVisibility;
      });
    }
  };

  const handleLikedToggle = (index) => {
    setLiked((prevLiked) =>
      prevLiked.map((status, i) => (i === index ? !status : status))
    );
    setLikesCount((prevCounts) =>
      prevCounts.map((count, i) =>
        i === index ? count + (liked[index] ? -1 : 1) : count
      )
    );
  };

  const handleComment = (index) => {
    if (commentInput[index]?.trim()) {
      const newComments = [...comments];
      newComments[index] = [...(newComments[index] || []), commentInput[index]];
      setComments(newComments);

      const newCommentInput = [...commentInput];
      newCommentInput[index] = "";
      setCommentInput(newCommentInput);
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

  const handleDeletePost = (index) => {
    // Implement delete functionality
    console.log(`Delete post at index: ${index}`);
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
    if (isLoaded) return;

    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        if (data && data.length > 0) {
          const textPosts = [];
          const imagePosts = [];
          const likes = [];
          const likedStatus = [];
          const comments = [];
          const commentInputs = [];
          const usernames = [];

          for (const post of data) {
            textPosts.push(post.text);
            imagePosts.push(post.img_url || "");
            likes.push(0);
            likedStatus.push(false);
            comments.push([]);
            commentInputs.push("");

            if (post.userId) {
              const user = await getUserById(post.userId);
              if (user) {
                usernames.push(user.username);
              } else {
                usernames.push("Unknown User");
              }
            } else {
              usernames.push("Unknown User");
            }
          }

          setTextPostContent(textPosts);
          setImagePostContent(imagePosts);
          setLikesCount(likes);
          setLiked(likedStatus);
          setComments(comments);
          setCommentInput(commentInputs);
          setPostUsernames(usernames);
          setIsLoaded(true);
        } else {
          console.error("No posts found");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPosts();
  }, [isLoaded]);

  const addNewPost = async (newPostContent, newImageContent) => {
    let imageUrl = null;

    if (newImageContent) {
      imageUrl = await uploadImageToGoogleCloud(newImageContent);
    }

    // Use username to get userId
    const userDoc = await getUserByUsername(username);
    const userId = userDoc ? userDoc.id : null;

    if (!userId) {
      console.error("User ID not found for username:", username);
      return;
    }

    const postDetail = {
      text: newPostContent,
      userId,
      img_url: imageUrl,
      createdAt: Timestamp.now(),
    };

    await addPost(postDetail);

    setTextPostContent((prev) => [newPostContent, ...prev]);
    setImagePostContent((prev) => [imageUrl, ...prev]);
    setLikesCount((prev) => [0, ...prev]);
    setLiked((prev) => [false, ...prev]);
    setComments((prev) => [[], ...prev]);
    setCommentInput((prev) => ["", ...prev]);
    setPostUsernames((prev) => [username, ...prev]);
  };

  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-row p-3 items-center">
        <div className="mx-4">{username || ""}</div>
        <Button
          onClick={handleCreatePost}
          className="!rounded-2xl flex-1 !bg-gray-700 !text-white !text-start hover:!bg-gray-600"
        >
          Post Here
        </Button>
      </div>

      <div className="flex flex-col max-w-full gap-5">
        {textPostContent.length > 0 ? (
          textPostContent.map((postData, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800"
              style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            >
              <div className="flex flex-col">
                <div className="text-lg font-semibold mb-2 flex justify-between">
                  <div>{postUsernames[index]} </div>
                  <div className="relative">
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
                        <ul className="py-1">
                          <li
                            className="px-4 py-2  hover:bg-gray-500 cursor-pointer"
                            onClick={() => handleEditPost(index)}
                          >
                            Edit Post
                          </li>
                          <li
                            className="px-4 py-2  hover:bg-gray-500  cursor-pointer"
                            onClick={() => handleDeletePost(index)}
                          >
                            Delete Post
                          </li>
                          <li
                            className="px-4 py-2  hover:bg-gray-500  cursor-pointer"
                            onClick={() => handleHidePost(index)}
                          >
                            Hide Post
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4 break-words flex">
                  <div className="p-2">{postData}</div>
                </div>

                {imagePostContent[index] && (
                  <div className="mb-4">
                    <img
                      src={imagePostContent[index]}
                      alt="Post"
                      className="w-full max-w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                )}

                <div className="border-t-2 border-gray-500 p-2 pt-4">
                  <div className="flex space-x-4 items-end justify-between pb-2">
                    <div className="flex flex-row gap-3">
                      {likesCount[index] > 0 && (
                        <span className="items-end flex">
                          {likesCount[index]} likes
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => showCommentPost(index)}
                      className="cursor-pointer"
                    >
                      {comments[index]?.length > 0 && (
                        <div>{comments[index].length} comments</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-10">
                    <div
                      onClick={() => handleLikedToggle(index)}
                      className="cursor-pointer hover:text-gray-600 flex items-end"
                    >
                      {liked[index] ? (
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

                {commentVisibility[index] && comments[index].length <= 2 && (
                  <div className="flex flex-col gap-3 mt-4 border-t-2 border-gray-600 pt-4">
                    {comments[index].map((comment, i) => (
                      <div key={i} className="bg-gray-700 p-2 rounded-lg mt-2">
                        <div className="px-3">
                          <div>{username}</div>
                          <div className="text-sm py-2">{comment}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-row gap-3 mt-2">
                      <div>{username}</div>
                      <div className="flex-1 px-5">
                        <TextField
                          placeholder="Write a comment..."
                          variant="outlined"
                          className="!bg-gray-700 !rounded-xl"
                          value={commentInput[index] || ""}
                          maxRows={6}
                          fullWidth
                          multiline
                          onChange={(e) => {
                            const newCommentInput = [...commentInput];
                            newCommentInput[index] = e.target.value;
                            setCommentInput(newCommentInput);
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
                        <div className="text-end pt-3">
                          <SendIcon
                            onClick={() => handleComment(index)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No post yet</p>
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
              post={textPostContent[currentPostIndex]}
              image={imagePostContent[currentPostIndex]}
              comments={comments[currentPostIndex]}
              addComment={(comment) => addComment(currentPostIndex, comment)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
