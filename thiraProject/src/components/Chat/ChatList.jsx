import React, { useEffect, useContext } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";

const ChatList = () => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { chats, fetchChats, getOrCreateChat } = useChat();

  useEffect(() => {
    if (isAuthenticated && userId) {
      const unsubscribe = fetchChats();
      return () => unsubscribe && unsubscribe();
    }
  }, [isAuthenticated, userId, fetchChats]);

  const handleChatClick = async (otherUserId) => {
    const chatId = await getOrCreateChat(otherUserId);
    navigate(`/chat/${chatId}`);
  };

  // Function to check if a string is a URL
  const isUrl = (text) => {
    try {
      const url = new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Function to determine if the URL is an image
  const isImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  };

  // Function to format the last message display
  const formatLastMessage = (username, lastMessage) => {
    if (!lastMessage) {
      return "No messages yet.";
    }
    if (isUrl(lastMessage)) {
      return isImageUrl(lastMessage) ? "Image sent" : "File sent";
    }
    // Truncate message if too long
    const maxLength = 30;
    const truncatedMessage =
      lastMessage.length > maxLength
        ? `${lastMessage.substring(0, maxLength)}...`
        : lastMessage;
    return `${username}: ${truncatedMessage}`;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-semibold text-white mb-6">Your Chats</h2>
      {chats.length === 0 ? (
        <Typography variant="body1" className="text-gray-400">
          You have no chats yet.
        </Typography>
      ) : (
        <List className="space-y-2">
          {chats.map((chat) => (
            <ListItem
              button
              component="div"
              key={chat.id}
              onClick={() => handleChatClick(chat.otherUser.id)}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <Avatar
                src={chat.otherUser?.profile_url || "/defaultProfile.webp"}
                alt={chat.otherUser?.username || "User"}
                className="mr-4"
              />
              <ListItemText
                primary={
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium text-lg">
                      {chat.otherUser?.username || "Unknown User"}
                    </span>
                    <span className="text-sm text-gray-400 break-words">
                      {chat.lastMessageTimestamp &&
                        new Date(
                          chat.lastMessageTimestamp.toDate()
                        ).toLocaleString()}
                    </span>
                  </div>
                }
                secondary={
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className="text-gray-400 truncate"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {formatLastMessage(
                        chat.otherUser?.username || "User",
                        chat.lastMessage
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {chat.lastMessageTimestamp &&
                        formatDistanceToNow(
                          chat.lastMessageTimestamp.toDate(),
                          {
                            addSuffix: true,
                          }
                        )}
                    </span>
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default ChatList;
