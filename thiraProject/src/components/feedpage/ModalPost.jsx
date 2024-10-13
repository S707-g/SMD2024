import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { formatDistanceToNow } from "date-fns";

const ModalPost = ({ post, handleComment }) => {
  const [commentInput, setCommentInput] = useState("");

  const handleCommentSubmit = () => {
    console.log("handleCommentSubmit called with commentInput:", commentInput);
    if (commentInput.trim()) {
      handleComment(commentInput.trim()); // Add new comment
      setCommentInput(""); // Clear input
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white w-[800px] max-w-lg h-full overflow-y-auto max-h-[90vh]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center pb-4 border-b-2 border-gray-600">
          <span className="text-xl font-semibold">{post.username}'s post </span>
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

        {/* Post Image */}
        {post.img_url && (
          <img
            src={post.img_url}
            alt="Post"
            className="w-full h-auto max-h-96 object-contain rounded-lg"
          />
        )}

        {/* Comments Section */}
        <div
          className="border-t border-gray-600 pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 p-2"
          style={{ maxHeight: "250px" }}
        >
          <div className="text-sm font-semibold mb-2">Comments:</div>
          <div className="flex flex-col-reverse">
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start bg-gray-700 p-3 rounded-lg mb-2"
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
                </div>
              ))
            ) : (
              <div className="text-gray-400">No comments yet</div>
            )}
          </div>
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
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleCommentSubmit()
            }
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
    </div>
  );
};

export default ModalPost;
