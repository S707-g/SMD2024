import React from "react";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ModalPost = ({ post, image, comments, addComment }) => {
  const [commentInput, setCommentInput] = React.useState("");
  const { username } = useContext(AuthContext);

  const handleCommentSubmit = () => {
    if (commentInput.trim()) {
      addComment(commentInput); // Add new comment
      setCommentInput(""); // Clear input
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white w-[800px] max-w-lg h-full overflow-y-auto max-h-[90vh]">
      <div className="flex flex-col gap-4">
        {/* Display Post Content */}
        <div className="text-lg font-semibold">{username}</div>
        <div className="p-2 break-words">{post}</div>

        {/* Display Image if Available */}
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Post"
            className="w-full h-auto max-h-96 object-contain rounded-lg"
          />
        ) : (
          ""
        )}

        {/* Display Comments */}
        <div
          className="border-t border-gray-600 pt-4 overflow-y-auto"
          style={{ maxHeight: "250px" }}
        >
          <div className="text-sm font-semibold mb-2">Comments:</div>
          <div className="flex flex-col-reverse">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg mb-2 ">
                  <div>{username}</div>
                  <div className="text-sm py-1 break-words">{comment}</div>
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
