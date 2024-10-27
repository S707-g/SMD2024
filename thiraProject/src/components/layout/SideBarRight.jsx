import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";
import { Avatar, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SideBarRight = () => {
  const { userId } = useContext(AuthContext); // Access the current user ID
  const { chats, fetchChats, getOrCreateChat } = useChat(); // Use the useChat hook
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredChats, setFilteredChats] = useState([]); // State for filtered contacts

  useEffect(() => {
    if (userId) {
      const unsubscribe = fetchChats();
      return () => unsubscribe && unsubscribe();
    }
  }, [userId, fetchChats]);

  // Update the filtered contacts based on the search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
        chat.otherUser?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, chats]);

  const handleChatClick = async (otherUserId) => {
    const chatId = await getOrCreateChat(otherUserId);
    if (chatId) {
      navigate(`/chat/${chatId}`); // Navigate to the chat window
    }
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      <TextField
        variant="outlined"
        placeholder="Search contacts..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        inputProps={{
          style: {
            color: "white", // Text color for the search input
          },
        }}
        InputLabelProps={{
          style: {
            color: "gray", // Placeholder text color
          },
        }}
      />
      {filteredChats.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleChatClick(chat.otherUser.id)}
            >
              <Avatar
                src={chat.otherUser?.profile_url || "/defaultProfile.webp"}
                alt={chat.otherUser?.username || "User"}
                className="w-10 h-10"
              />
              <span className="text-md font-medium">
                {chat.otherUser?.username || "Unknown User"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SideBarRight;
