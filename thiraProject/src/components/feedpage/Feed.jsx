import { Button } from "@mui/material";
import React, { useState } from "react";
import CreatePost from "./CreatePost";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite"; // Filled heart

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [textPostContent, setTextPostContent] = useState([]); // Text posts
  const [imagePostContent, setImagePostContent] = useState([]); // Image posts
  const [likesCount, setLikesCount] = useState([]); // Initialize likesCount as an empty array
  const [liked, setLiked] = useState([]); // Initialize liked as an empty array

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const closeCreatePost = () => {
    setShowCreatePost(false);
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

  // Update both textPostContent and imagePostContent, and initialize likesCount and liked arrays when adding a post
  const addNewPost = (newPostContent, newImageContent) => {
    setTextPostContent((prevContent) => [...prevContent, newPostContent]);
    setImagePostContent((prevContent) => [...prevContent, newImageContent]);
    setLikesCount((prevCounts) => [...prevCounts, 0]); // Initialize like count to 0 for the new post
    setLiked((prevLiked) => [...prevLiked, false]); // Initialize liked status to false for the new post
  };

  return (
    <div className="flex flex-col w-full">
      {/* Button to trigger the post creation */}
      <Button
        variant="contained"
        onClick={handleCreatePost}
        className="!flex !sticky"
      >
        Post here
      </Button>

      {/* Display the post content */}
      <div className="flex flex-col max-w-full ">
        {textPostContent.length > 0 ? (
          textPostContent.map((postData, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-2"
              style={{
                overflowWrap: "break-word", // Ensure long words wrap
                wordBreak: "break-word", // Break words if necessary
              }}
            >
              <div className="flex flex-col ">
                <div className="text-lg font-semibold mb-2">Profile</div>

                {/* Display Text Content */}
                <div className="mb-4 break-words flex">
                  {/* Add padding or margin to control spacing */}
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

                {/* Like and Comment buttons */}
                <div className="flex space-x-4 items-center">
                  <div
                    onClick={() => handleLikedToggle(index)} // Pass the index here
                    className="cursor-pointer hover:text-gray-600"
                  >
                    {liked[index] ? (
                      <FavoriteIcon className="text-red-600" /> // Filled heart (liked)
                    ) : (
                      <FavoriteBorderIcon /> // Outlined heart (unliked)
                    )}
                  </div>
                  <span>
                    {likesCount[index] !== undefined &&
                    !isNaN(likesCount[index])
                      ? likesCount[index]
                      : 0}{" "}
                    likes
                  </span>{" "}
                  {/* Display like count */}
                  <Button>Comment</Button>
                </div>
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
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeCreatePost} // Close modal when clicking the background
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeCreatePost}
            >
              ✕
            </button>

            {/* Pass setTextPostContent and setImagePostContent as props */}
            <CreatePost
              textPostContent={(text, image) => addNewPost(text, image)} // Call addNewPost with text and image
              closePost={closeCreatePost}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
