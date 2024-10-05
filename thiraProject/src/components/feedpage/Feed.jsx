import { Button } from "@mui/material";
import React, { useState } from "react";
import CreatePost from "./CreatePost";

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [dataPostContent, setDataPostContent] = useState([]);

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const closeCreatePost = () => {
    setShowCreatePost(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Button to trigger the post creation */}
      <Button
        variant="contained"
        onClick={handleCreatePost}
        className="flex sticky"
      >
        Post here
      </Button>

      {/* Display the post content */}

      <div className="flex flex-col max-w-full ">
        {dataPostContent.length > 0 ? (
          dataPostContent.map((postData, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-2"
            >
              <div className="flex flex-col ">
                <div className="text-lg font-semibold mb-2">Profile</div>
                <div className="mb-4 break-words flex ">{postData}</div>
                <div className="mb-4">IMG</div>
                {/* Like and Comment buttons */}
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Like
                  </button>
                  <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Comment
                  </button>
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

            {/* Pass setDataPostContent as a prop */}
            <CreatePost
              DataPostContent={setDataPostContent}
              closePost={closeCreatePost}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
