import React, { useState, useContext, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreatePost from "./CreatePost";
import ModalPost from "./ModalPost";
import Login from "../layout/login/Login";
import AuthContext from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";

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
  const [currentPostIndex, setCurrentPostIndex] = useState(null);
  const [commentVisibility, setCommentVisibility] = useState([]);

  // Open CreatePost or Login modal based on authentication status
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

  // Toggle comment visibility for the current post
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

  // Toggle like status and adjust like count
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

  // Handle adding a new comment to a specific post
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

  // Add new post with text and optional image
  const addNewPost = (newPostContent, newImageContent) => {
    setTextPostContent((prev) => [...prev, newPostContent]);
    setImagePostContent((prev) => [...prev, newImageContent]);
    setLikesCount((prev) => [...prev, 0]);
    setLiked((prev) => [...prev, false]);
    setComments((prev) => [...prev, []]);
    setCommentInput((prev) => [...prev, ""]);
  };

  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-row p-3 items-center">
        <div className="mx-4">{username || "loading.."}</div>
        <Button
          onClick={handleCreatePost}
          className="!rounded-2xl flex-1 !bg-gray-700 !text-white !text-start hover:!bg-gray-600"
        >
          Post Here
        </Button>
      </div>

      <div className="flex flex-col-reverse max-w-full gap-5">
        {textPostContent.length > 0 ? (
          textPostContent.map((postData, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800"
              style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            >
              <div className="flex flex-col">
                <div className="text-lg font-semibold mb-2">Profile</div>
                <div className="mb-4 break-words flex">
                  <div className="p-2">{postData}</div>
                </div>

                {imagePostContent[index] && (
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(imagePostContent[index])}
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
                          <div>Profile</div>
                          <div className="text-sm py-2">{comment}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-row gap-3 mt-2">
                      <div>Profile</div>
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
                setShowCreatePost(true); // Immediately open the CreatePost modal after login
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
