import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";
import useUser from "../../hooks/useUser";
import { useUpload } from "../../hooks/useUpload";
import db from "../../database/FirebaseConfig";

const ChatWindow = () => {
  const { chatId } = useParams();
  const { userId, username: currentUsername } = useContext(AuthContext);
  const { messages, fetchMessages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const { getUserById } = useUser();
  const { upload } = useUpload();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const chatListRef = useRef(null); // Reference to the chat list container

  useEffect(() => {
    if (chatId) {
      const unsubscribe = fetchMessages(chatId);
      return () => unsubscribe && unsubscribe();
    }
  }, [chatId, fetchMessages]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const otherUserId = chatData.users.find((id) => id !== userId);
        const otherUserData = await getUserById(otherUserId);
        setOtherUser(otherUserData);
      }
    };

    if (chatId) {
      fetchOtherUser();
    }
  }, [chatId, userId, getUserById]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      await handleImageUpload();
    } else if (newMessage.trim()) {
      sendMessage(chatId, newMessage);
      setNewMessage("");
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const uploadPromises = selectedFiles.map((file) => upload(file));
      const uploadedImages = await Promise.all(uploadPromises);
      console.log("Uploaded images:", uploadedImages);
      uploadedImages.forEach(({ data }) => {
        console.log("Upload response data:", data);
        if (data && data.url) {
          sendMessage(chatId, data.url);
        } else if (data && data.path) {
          sendMessage(chatId, data.path);
        } else {
          console.error("Image URL not found in upload response:", data);
        }
      });
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (e) {
      console.error("Failed to upload images:", e);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  // Navigate to other user's profile or self profile
  const handleProfileClick = (profileUserId, profileUsername) => {
    if (profileUserId === userId) {
      navigate(`/profile/${currentUsername}`); // Navigate to self profile
    } else {
      navigate(`/profile/${profileUsername}`); // Navigate to other user's profile
    }
  };

  return (
    <div className="p-4">
      <h2>
        Chat with{" "}
        <span
          onClick={() => handleProfileClick(otherUser?.id, otherUser?.username)}
          style={{ cursor: "pointer", color: "blue" }} // Make username clickable
        >
          {otherUser?.username || "User"}
        </span>
      </h2>
      <div
        className="overflow-y-auto max-h-[500px] mb-1 scrollbar-thin scrollbar-thumb-scrollbar-thumb "
        ref={chatListRef} // Assign the reference to this container
      >
        <List>
          {messages.map((message) => {
            const isOwnMessage = message.senderId === userId;
            const isImageUrl = (url) => {
              try {
                new URL(url);
                return true;
              } catch (e) {
                return false;
              }
            };

            return (
              <ListItem
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: isOwnMessage ? "row-reverse" : "row",
                    maxWidth: "70%",
                  }}
                >
                  <Avatar
                    src={
                      isOwnMessage
                        ? "/myAvatar.png"
                        : otherUser?.profile_url || "/defaultProfile.webp"
                    }
                    alt="User Avatar"
                    style={{ margin: "0 8px", cursor: "pointer" }}
                    onClick={() =>
                      handleProfileClick(
                        isOwnMessage ? userId : otherUser?.id,
                        isOwnMessage ? currentUsername : otherUser?.username
                      )
                    }
                  />
                  {isImageUrl(message.text) ? (
                    <img
                      src={message.text}
                      alt="Sent"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <ListItemText
                      primary={message.text}
                      secondary={new Date(
                        message.timestamp?.toDate()
                      ).toLocaleString()}
                      style={{
                        backgroundColor: isOwnMessage ? "#dcf8c6" : "#f1f0f0",
                        padding: "10px",
                        borderRadius: "10px",
                        wordWrap: "break-word",
                        maxWidth: "100%",
                      }}
                    />
                  )}
                </div>
              </ListItem>
            );
          })}
        </List>
      </div>

      {imagePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-40 h-40 object-cover rounded-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex mt-4 items-center">
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          fullWidth
          multiline
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="upload-image"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="upload-image">
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        <Button onClick={handleSendMessage} variant="contained" color="primary">
          {selectedFiles.length > 0 ? "Send Images" : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
