import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import CreatePost from "./CreatePost";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite"; // Filled heart
import SendIcon from "@mui/icons-material/Send";

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [textPostContent, setTextPostContent] = useState([]); // Text posts
  const [imagePostContent, setImagePostContent] = useState([]); // Image posts
  const [showComment, setShowComment] = useState([]); // Comment visibility for each post
  const [comments, setComments] = useState([]); // Store comments for each post
  const [commentInput, setCommentInput] = useState([]); // Track comment input for each post
  const [likesCount, setLikesCount] = useState([]); // Initialize likesCount as an empty array
  const [liked, setLiked] = useState([]); // Initialize liked as an empty array

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const closeCreatePost = () => {
    setShowCreatePost(false);
  };

  const showCommentPost = (index) => {
    const updatedShowComment = [...showComment];
    updatedShowComment[index] = !updatedShowComment[index]; // Toggle comment visibility for specific post
    setShowComment(updatedShowComment);
  };

  // Toggle liked state and update the count
  const handleLikedToggle = (index) => {
    const updatedLiked = [...liked];
    const updatedLikesCount = [...likesCount];

    updatedLiked[index] = !updatedLiked[index]; // Toggle the like status
    updatedLikesCount[index] = updatedLiked[index]
      ? updatedLikesCount[index] + 1 // Increment if liked
      : updatedLikesCount[index] - 1; // Decrement if unliked

    setLiked(updatedLiked);
    setLikesCount(updatedLikesCount);
  };

  // Handle adding a comment to a specific post
  const handleComment = (index) => {
    const newComments = [...comments];
    const newCommentInput = [...commentInput];

    if (newCommentInput[index]?.trim()) {
      // If there are already comments, append to that array; otherwise, initialize
      if (newComments[index]) {
        newComments[index].push(newCommentInput[index]);
      } else {
        newComments[index] = [newCommentInput[index]];
      }

      setComments(newComments);
      newCommentInput[index] = ""; // Clear the input after submission
      setCommentInput(newCommentInput);
    }
  };

  // Update both textPostContent and imagePostContent, and initialize likesCount, liked, showComment, and comments arrays when adding a post
  const addNewPost = (newPostContent, newImageContent) => {
    setTextPostContent((prevContent) => [...prevContent, newPostContent]);
    setImagePostContent((prevContent) => [...prevContent, newImageContent]);
    setLikesCount((prevCounts) => [...prevCounts, 0]); // Initialize like count to 0 for the new post
    setLiked((prevLiked) => [...prevLiked, false]); // Initialize liked status to false for the new post
    setShowComment((prevShowComment) => [...prevShowComment, false]); // Initialize comment visibility to false for the new post
    setComments((prevComments) => [...prevComments, []]); // Initialize comments to an empty array for the new post
    setCommentInput((prevCommentInput) => [...prevCommentInput, ""]); // Initialize the comment input to an empty string for the new post
  };

  return (
    <div className="flex flex-col text-white">
      {/* Button to trigger the post creation */}
      <div className="flex flex-row p-3 items-center">
        <div className="mx-4">Profile</div>
        <Button
          onClick={handleCreatePost}
          className="!rounded-2xl flex-1 !bg-gray-700 !text-white !text-start hover:!bg-gray-600"
        >
          Post Here
        </Button>
      </div>

      {/* Display the post content */}
      <div className="flex flex-col max-w-full gap-5">
        {textPostContent.length > 0 ? (
          textPostContent.map((postData, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800"
              style={{
                overflowWrap: "break-word", // Ensure long words wrap
                wordBreak: "break-word", // Break words if necessary
              }}
            >
              <div className="flex flex-col">
                <div className="text-lg font-semibold mb-2">Profile</div>

                {/* Display Text Content */}
                <div className="mb-4 break-words flex">
                  <div className="p-2">{postData}</div>
                </div>

                {/* Display Image Content */}
                {imagePostContent[index] && (
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(imagePostContent[index])}
                      alt="Post Image"
                      className="w-full max-w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                )}
                <div className="border-t-2 border-gray-500 p-2 pt-4 ">
                  {/* Like and Comment buttons */}
                  <div className="flex   space-x-4 items-end justify-between pb-2">
                    <div className="flex flex-row gap-3">
                      {likesCount[index] > 0 && (
                        <span className="items-end flex">
                          {likesCount[index] !== undefined &&
                          !isNaN(likesCount[index])
                            ? likesCount[index]
                            : 0}{" "}
                          likes
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => showCommentPost(index)}
                      className="cursor-pointer"
                    >
                      {comments[index]?.length > 0 && (
                        <div>{comments[index]?.length} comments</div>
                      )}
                    </div>
                  </div>

                  <div className=" flex flex-row items-center gap-10">
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
                    <Button>Comment</Button>
                  </div>
                </div>
                {/* Comment section */}
                {showComment[index] && (
                  <div className="flex flex-col gap-3 mt-4 border-t-2 border-gray-600 pt-4">
                    <div className="flex flex-row gap-3">
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
                            "& .MuiInputBase-root": {
                              color: "white",
                            },
                            "& .MuiInputLabel-root": {
                              color: "gray",
                            },
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
                          <SendIcon onClick={() => handleComment(index)} />
                        </div>
                      </div>
                    </div>

                    {/* Display existing comments */}
                    {comments[index] &&
                      comments[index].map((comment, i) => (
                        <div
                          key={i}
                          className="bg-gray-700 p-2 rounded-lg mt-2"
                        >
                          <span className="text-sm">Profile: {comment}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No post yet</p>
        )}
      </div>

      {/* Modal for creating a post */}
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
    </div>
  );
};

export default Feed;
