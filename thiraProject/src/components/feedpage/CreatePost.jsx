import React, { useState, useContext } from "react";
import { TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import AuthContext from "../../context/AuthContext";
import { useUpload } from "../../hooks/useUpload";

const CreatePost = ({ textPostContent, closePost }) => {
  const [localPostContent, setLocalPostContent] = useState("");
  const [showInputImage, setShowInputImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { username } = useContext(AuthContext);
  const { upload } = useUpload();

  const handleInputChange = (event) => {
    setLocalPostContent(event.target.value); // Update local input state
  };

  const handleShowInputImageClicked = () => {
    setShowInputImage(true);
  };

  const handlePostClick = () => {
    if (localPostContent.trim() || selectedFile) {
      // Pass both text and image content
      textPostContent(localPostContent, selectedFile);
      setLocalPostContent(""); // Clear the input field after posting
      closePost(); // Close the post creation modal
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await upload(file);
      setImagePreviewUrl(data.data.path);
      setSelectedFile(data.data.path);
    }
  };

  return (
    <div className="flex flex-col rounded-lg p-4 w-[500px] max-w-lg mx-auto">
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
          <div className="font-semibold">{username}</div>
          <div className="text-sm text-gray-500"></div>
        </div>
      </div>

      {/* Text Input */}
      <TextField
        id="standard-multiline-flexible"
        placeholder="What's on your mind?"
        multiline
        rows={4}
        value={localPostContent}
        onChange={handleInputChange}
        variant="standard"
        fullWidth
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

      {showInputImage && (
        <div className="mt-4">
          {/* Styled file input */}
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <ImageIcon className="mr-2" />
            {selectedFile ? selectedFile.name : "Choose an image"}
          </label>

          {/* Image Preview */}
          {imagePreviewUrl && (
            <div className="mt-4">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-80 h-50 max-w-full max-h-60 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center mt-2">
        <div className="cursor-pointer">
          <ImageIcon
            className="text-2xl"
            onClick={handleShowInputImageClicked}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handlePostClick}
        >
          Post
        </button>
      </footer>
    </div>
  );
};

export default CreatePost;
