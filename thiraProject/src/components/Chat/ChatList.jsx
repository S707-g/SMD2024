import React, { useEffect, useContext } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns"; // Import from date-fns
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
  const formatLastMessage = (lastMessage) => {
    if (isUrl(lastMessage)) {
      return isImageUrl(lastMessage) ? "Image sent" : "File sent";
    }
    return lastMessage;
  };

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Your Chats
      </Typography>
      {chats.length === 0 ? (
        <Typography variant="body1">You have no chats yet.</Typography>
      ) : (
        <List>
          {chats.map((chat) => (
            <ListItem
              button
              component="div"
              key={chat.id}
              onClick={() => handleChatClick(chat.otherUser.id)}
              alignItems="flex-start"
            >
              <Avatar
                src={chat.otherUser?.profile_url || "/defaultProfile.webp"}
                alt={chat.otherUser?.username || "User"}
                className="mr-3"
              />
              <ListItemText
                primary={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{chat.otherUser?.username || "Unknown User"}</span>
                    <span style={{ fontSize: "0.8rem", color: "gray" }}>
                      {chat.lastMessageTimestamp &&
                        new Date(
                          chat.lastMessageTimestamp.toDate()
                        ).toLocaleString()}
                    </span>
                  </div>
                }
                secondary={
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {formatLastMessage(chat.lastMessage) ||
                          "No messages yet."}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "gray",
                          textAlign: "right",
                        }}
                      >
                        {chat.lastMessageTimestamp &&
                          formatDistanceToNow(
                            chat.lastMessageTimestamp.toDate(),
                            { addSuffix: true }
                          )}
                      </span>
                    </div>
                  </>
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
