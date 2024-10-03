import { Button } from "@mui/material";
import React, { useState } from "react";

const Feed = () => {
  const [showCreatePost, setShowCraetePost] = useState(false);

  const handleCreatePost = () => {
    setShowCraetePost(true);
  };

  return (
    <div className="flex flex-col justify-center">
      <Button onClick={handleCreatePost}>Post here</Button>

      {showCreatePost && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative"></div>
        </div>
      )}
    </div>
  );
};
export default Feed;
