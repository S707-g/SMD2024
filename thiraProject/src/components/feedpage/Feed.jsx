import React, { useState, useContext } from "react";
import { Button, TextField } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreatePost from "./CreatePost";
import ModalPost from "./ModalPost";
import Login from "../layout/login/Login";
import AuthContext from "../../context/AuthContext";
import usePost from "../../hooks/usePost";

const Feed = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const { posts, addPost, updatePost, loading, error } = usePost();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(null);

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
    setCurrentPostIndex(index);
    setShowModalPost(true);
  };

  // Toggle like status and adjust like count
  const handleLikedToggle = (postId, isLiked, likesCount) => {
    const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
    updatePost(postId, { likesCount: newLikesCount, isLiked: !isLiked });
  };

  // Handle adding a new comment to a specific post
  const handleComment = (postId, commentText) => {
    const post = posts.find((post) => post.id === postId);
    if (post && commentText.trim()) {
      const updatedComments = [...(post.comments || []), commentText];
      updatePost(postId, { comments: updatedComments });
    }
  };

  // Add new post with text and optional image
  const addNewPost = (newPostContent, newImageContent) => {
    const newPost = {
      content: newPostContent,
      image: newImageContent,
      comments: [],
      likesCount: 0,
      isLiked: false,
    };
    addPost(newPost);
  };

  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-row p-3 items-center">
        <div className="mx-4">Profile</div>
        <Button
          onClick={handleCreatePost}
          className="!rounded-2xl flex-1 !bg-gray-700 !text-white !text-start hover:!bg-gray-600"
        >
          Post Here
        </Button>
      </div>

      <div className="flex flex-col-reverse max-w-full gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800"
              style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            >
              <div className="flex flex-col">
                <div className="text-lg font-semibold mb-2">Profile</div>
                <div className="mb-4 break-words flex">
                  <div className="p-2">{post.content}</div>
                </div>

                {post.image && (
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(post.image)}
                      alt="Post"
                      className="w-full max-w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                )}

                <div className="border-t-2 border-gray-500 p-2 pt-4">
                  <div className="flex space-x-4 items-end justify-between pb-2">
                    <div className="flex flex-row gap-3">
                      {post.likesCount > 0 && (
                        <span className="items-end flex">
                          {post.likesCount} likes
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => showCommentPost(index)}
                      className="cursor-pointer"
                    >
                      {post.comments?.length > 0 && (
                        <div>{post.comments.length} comments</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-10">
                    <div
                      onClick={() =>
                        handleLikedToggle(
                          post.id,
                          post.isLiked,
                          post.likesCount
                        )
                      }
                      className="cursor-pointer hover:text-gray-600 flex items-end"
                    >
                      {post.isLiked ? (
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
              post={posts[currentPostIndex]?.content}
              image={posts[currentPostIndex]?.image}
              comments={posts[currentPostIndex]?.comments}
              addComment={(comment) =>
                handleComment(posts[currentPostIndex].id, comment)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
