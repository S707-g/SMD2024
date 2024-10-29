import React from "react";
import { formatDistanceToNow } from "date-fns";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const PostCard = ({ post, onLikeToggle, onCommentClick, onBookmarkToggle }) => {
  // Check if `post.createdAt` is a valid date
  const postDate = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);

  return (
    <div className="border border-gray-400 rounded-lg shadow-md p-4 mb-2 bg-gray-800">
      <div className="flex flex-col">
        
        {/* Post Header */}
        <div className="flex items-center mb-2">
          <img
            src={post.profilePic || "/defaultProfile.webp"}
            alt={`${post.username}'s profile`}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="flex flex-col">
            <div className="text-lg font-semibold">{post.username}</div>
            <div className="text-sm text-gray-400">
              {postDate && !isNaN(postDate) 
                ? formatDistanceToNow(postDate, { addSuffix: true }) 
                : "Unknown time"}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4 break-words">{post.text}</div>

        {/* Post Images */}
        {post.img_urls && post.img_urls.length > 0 && (
          <div className="flex gap-2 mt-2">
            {post.img_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post Image ${index + 1}`}
                className="object-cover rounded-md cursor-pointer max-w-full max-h-[300px]"
              />
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="border-t-2 border-gray-500 p-2 pt-4 flex items-center justify-between">
          <div className="flex gap-5 items-center">
            {/* Like Button */}
            <div 
              onClick={() => onLikeToggle(post.id)} 
              className="cursor-pointer flex items-center gap-1"
            >
              {post.liked ? (
                <FavoriteIcon className="text-red-600" />
              ) : (
                <FavoriteBorderIcon />
              )}
              {post.likesCount > 0 && <span>{post.likesCount}</span>}
            </div>

            {/* Comment Button */}
            <div 
              onClick={() => onCommentClick(post.id)} 
              className="cursor-pointer flex items-center gap-1"
            >
              <ChatBubbleOutlineIcon />
              {post.comments.length > 0 && <span>{post.comments.length}</span>}
            </div>
            {/* Bookmark Button */}
          <div onClick={() => onBookmarkToggle(post.id)} className="cursor-pointer">
            {post.bookmarked ? (
              <BookmarkIcon className="text-yellow-500" />
            ) : (
              <BookmarkBorderIcon />
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
