import React, { useState, useContext } from "react";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { formatDistanceToNow } from "date-fns";
import AuthContext from "../../context/AuthContext";
import useComments from "../../hooks/useComments";
import DeleteIcon from "@mui/icons-material/Delete";

const ModalPost = ({ post, handleComment, updateCommentsForPost }) => {
  const [commentInput, setCommentInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { userId } = useContext(AuthContext);
  const { deleteComment, fetchCommentsForPost } = useComments();
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentSubmit = async () => {
    if (commentInput.trim()) {
      try {
        await handleComment(commentInput.trim()); // Add new comment
        setCommentInput(""); // Clear input

        // Refetch comments for the post after adding a new comment
        const updatedComments = await fetchCommentsForPost(post.id);
        setComments(updatedComments);

        // Update comments in Feed component
        updateCommentsForPost(post.id, updatedComments);
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("An error occurred while adding the comment.");
      }
    }
  };

  // Function to handle image click
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Refetch comments for the post after deletion
      const updatedComments = await fetchCommentsForPost(post.id);
      setComments(updatedComments);

      // Update comments in Feed component
      updateCommentsForPost(post.id, updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    }
  };

  const modalWidthClass =
    post.img_urls && post.img_urls.length > 0
      ? "w-full max-w-screen-md"
      : "w-[500px]";

  return (
    <div
      className={`p-4 bg-gray-800 rounded-lg text-white h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 ${modalWidthClass}`}
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center pb-4 border-b-2 border-gray-600">
          <span className="text-xl font-semibold">{post.username}'s post</span>
        </div>
        {/* Post Header */}
        <div className="flex items-center mb-4">
          <img
            src={post.profilePic || "/defaultProfile.webp"}
            alt={`${post.username}'s profile`}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <div className="text-lg font-semibold px-2">{post.username}</div>
            <div className="text-sm text-gray-400 px-2">
              {post.createdAt instanceof Date && !isNaN(post.createdAt)
                ? formatDistanceToNow(post.createdAt, { addSuffix: true })
                : "Just now"}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-2 break-words">{post.text}</div>

        {/* Post Images */}
        {post.img_urls && post.img_urls.length > 0 && (
          <div
            className={`mt-4 grid gap-2 ${
              post.img_urls.length === 1
                ? "grid-cols-1"
                : post.img_urls.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {post.img_urls.map((url, imgIndex) => (
              <img
                key={imgIndex}
                src={url}
                alt={`Post Image ${imgIndex + 1}`}
                className="object-cover rounded-md cursor-pointer w-full h-auto max-h-[500px]"
                onClick={() => handleImageClick(url)}
              />
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div
          className="border-t border-gray-600 pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 p-2"
          style={{ maxHeight: "250px" }}
        >
          {/* Comments Header with Count */}
          <div className="flex justify-between items-center text-base font-semibold mb-3">
            <div>Comments:</div>
            <div>
              {Array.isArray(comments) ? comments.length : 0}{" "}
              {comments && comments.length === 1 ? "Comment" : "Comments"}
            </div>
          </div>
          {Array.isArray(comments) && comments.length > 0 ? (
            <div className="flex flex-col-reverse">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start bg-gray-700 p-3 rounded-lg mb-2 relative"
                >
                  <img
                    src={comment.profilePic || "/defaultProfile.webp"}
                    alt={`${comment.username}'s profile`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <div className="flex items-center">
                      <div className="font-semibold mr-2">
                        {comment.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        {comment.createdAt instanceof Date &&
                        !isNaN(comment.createdAt)
                          ? formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </div>
                    </div>
                    <div className="text-sm py-1 break-words">
                      {comment.text}
                    </div>
                  </div>
                  {comment.userId === userId && (
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center">No comments yet</div>
          )}
        </div>

        {/* Comment Input */}
        <div className="flex items-center gap-2 mt-2">
          <TextField
            variant="outlined"
            placeholder="Write a comment..."
            className="flex-1 !bg-gray-700 !rounded-xl"
            value={commentInput}
            maxRows={3}
            fullWidth
            multiline
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevents the default newline behavior
                handleCommentSubmit();
              }
            }}
            sx={{
              "& .MuiInputBase-root": { color: "white" },
              "& .MuiInputLabel-root": { color: "gray" },
              "& .MuiInputLabel-root.Mui-focused": { color: "white" },
              "& .MuiInput-underline:before": { borderBottomColor: "white" },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": { borderBottomColor: "white" },
            }}
          />
          <Button onClick={handleCommentSubmit} aria-label="Submit comment">
            <SendIcon />
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeImageModal} // Close modal on click
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg relative text-white"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={closeImageModal}
            >
              ✕
            </button>
            {/* Full-size image with max dimensions to fit the screen */}
            <img
              src={selectedImage}
              alt="Full-size"
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalPost;
