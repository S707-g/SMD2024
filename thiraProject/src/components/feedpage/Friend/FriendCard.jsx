// FriendCard.jsx
import React from "react";
import Avatar from "@mui/material/Avatar";

const FriendCard = ({ user, onClick }) => {
  return (
    <li
      onClick={() => onClick(user.id)}
      className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
    >
      <Avatar
        src={user.profile_url || "/defaultProfile.webp"}
        alt={user.username || "User"}
        className="w-10 h-10"
      />
      <span className="text-md font-medium">{user.username || "Unknown User"}</span>
    </li>
  );
};

export default FriendCard;
