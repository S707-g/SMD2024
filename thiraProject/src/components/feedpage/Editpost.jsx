import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpload } from "../../hooks/useUpload"; // Import your upload hook

const EditPost = ({ post, onUpdate, onClose }) => {
  const [text, setText] = useState(post.text || "");
  const [existingImages, setExistingImages] = useState(post.img_urls || []); // Existing image URLs
  const [newImages, setNewImages] = useState([]); // New image files to be uploaded
  const [imagePreviews, setImagePreviews] = useState([]); // Previews of new images
  const { upload } = useUpload(); // Get the upload function

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSave = async () => {
    try {
      // Upload new images and get their URLs
      const uploadedImageUrls = await Promise.all(
        newImages.map(async (file) => {
          const data = await upload(file); // Upload the file
          return data.data.path; // Get the uploaded image URL
        })
      );

      // Combine existing images with new uploaded images
      const updatedImages = [...existingImages, ...uploadedImageUrls];

      // Call onUpdate with updated post data
      onUpdate({ ...post, text, img_urls: updatedImages });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("An error occurred while uploading images.");
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert file list to array
    setNewImages((prev) => [...prev, ...files]); // Add new image files to state

    // Create object URLs for previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]); // Add to previews
  };

  const handleRemoveExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleRemoveNewImage = (index) => {
    // Remove the file from newImages
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);

    // Remove the preview URL and revoke it
    URL.revokeObjectURL(imagePreviews[index]);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="flex flex-col text-white">
      <h2 className="text-xl mb-4">Edit Post</h2>
      <TextField
        label="Post Content"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          "& .MuiInputBase-root": { color: "white" },
          "& .MuiInputLabel-root": { color: "gray" },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "gray" },
            "&:hover fieldset": { borderColor: "white" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
        }}
      />

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg mb-2">Existing Images:</h3>
          <div className="grid grid-cols-2 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Existing Image ${index + 1}`}
                  className="w-full h-auto max-h-60 object-contain rounded-md"
                  style={{ border: "1px solid gray", borderRadius: "8px" }}
                />
                <Button
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                  style={{ minWidth: "0", padding: "8px" }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg mb-2">New Images:</h3>
          <div className="grid grid-cols-2 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`New Image ${index + 1}`}
                  className="w-full h-auto max-h-60 object-contain rounded-md"
                  style={{ border: "1px solid gray", borderRadius: "8px" }}
                />
                <Button
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                  style={{ minWidth: "0", padding: "8px" }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Images */}
      <div className="mt-4">
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-md inline-flex items-center"
        >
          <ImageIcon className="mr-2" />
          Add Images
        </label>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="!text-white !mr-2">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          className="!bg-blue-500"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditPost;
