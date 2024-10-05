import React, { useState } from "react";
import { TextField } from "@mui/material";

const CreatePost = ({ DataPostContent, closePost }) => {
  const [localPostContent, setLocalPostContent] = useState("");

  const handleInputChange = (event) => {
    setLocalPostContent(event.target.value); // Update local input state
  };

  const handlePostClick = () => {
    console.log("Post content from input:", localPostContent);
    DataPostContent((prevPosts) => [...prevPosts, localPostContent]);
    setLocalPostContent(""); // Clear the input field after posting
    closePost();
  };

  return (
    <div className="flex flex-col rounded-lg p-4 w-96 max-w-full">
      {/* Header */}
      <header className="flex items-center justify-center border-b-2 mb-2 pb-4">
        <div className="font-semibold text-lg">Create Post</div>
      </header>

      {/* Profile and Privacy Setting */}
      <div className="flex items-center space-x-2 p-4 m-4 justify-start w-full">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full"
        />
        <div>
          <div className="font-semibold">User Name</div>
          <div className="text-sm text-gray-500">
            <select className="text-sm bg-transparent focus:outline-none">
              <option value="public">Public</option>
              <option value="friends">Friends</option>
            </select>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <TextField
        id="standard-multiline-flexible"
        placeholder="What's on your mind?"
        className="!p-3 !my-3"
        multiline
        rows={4}
        value={localPostContent}
        onChange={handleInputChange} // Update local state on input
        variant="standard"
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

      {/* Footer */}
      <footer className="flex justify-between items-center mt-2">
        <div className="flex space-x-3"></div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handlePostClick} // Use the prop function to update parent state
        >
          Post
        </button>
      </footer>
    </div>
  );
};

export default CreatePost;
