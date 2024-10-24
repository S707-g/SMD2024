import React, { useState, useContext } from "react";
import { TextField } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthContext from "../../context/AuthContext";
import { useUpload } from "../../hooks/useUpload";

const CreatePost = ({ textPostContent, closePost }) => {
  const [localPostContent, setLocalPostContent] = useState("");
  const [showInputImage, setShowInputImage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Renamed to selectedFiles
  const { username, profilePic } = useContext(AuthContext);
  const { upload } = useUpload();

  const handleInputChange = (event) => {
    setLocalPostContent(event.target.value); // Update local input state
  };

  const handleShowInputImageClicked = () => {
    setShowInputImage(true);
  };

  const handlePostClick = () => {
    if (localPostContent.trim() || selectedFiles.length > 0) {
      // Pass both text and images content
      textPostContent(localPostContent, selectedFiles);
      setLocalPostContent(""); // Clear the input field after posting
      setSelectedFiles([]); // Clear selected images after posting
      closePost(); // Close the post creation modal
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files); // Get multiple files
    const uploadPromises = files.map(async (file) => {
      const data = await upload(file);
      return data.data.path;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    setSelectedFiles((prevFiles) => [...prevFiles, ...uploadedFiles]); // Add to existing images
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove image by index
  };

  return (
    <div className="flex flex-col rounded-lg p-4 w-[500px] max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-center border-b-2 mb-2 pb-4">
        <div className="font-semibold text-lg">Create Post</div>
      </header>

      {/* Profile and Privacy Setting */}
      <div className="flex items-center space-x-2 p-4 m-4 justify-start w-full">
        <img src={profilePic} alt="Profile" className="rounded-full" />
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
          {/* Styled file input for multiple images */}
          <input
            type="file"
            id="file-input"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <ImageIcon className="mr-2" />
            {selectedFiles.length > 0
              ? `${selectedFiles.length} files selected`
              : "Choose images"}
          </label>

          {/* Image Previews */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={file}
                    alt={`Preview ${index + 1}`}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
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
