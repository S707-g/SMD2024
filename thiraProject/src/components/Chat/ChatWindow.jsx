import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Avatar,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { format } from "date-fns";
import { PhotoCamera } from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";
import useUser from "../../hooks/useUser";
import { useUpload } from "../../hooks/useUpload";
import db from "../../database/FirebaseConfig";
import Picker from "emoji-picker-react";
import CallIcon from "@mui/icons-material/Call";

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
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const navigate = useNavigate();
  const lastMessageRef = useRef(null);
  const [messageProfiles, setMessageProfiles] = useState({});

  // Fetch messages when chatId changes
  useEffect(() => {
    if (chatId) {
      const unsubscribe = fetchMessages(chatId);
      return () => unsubscribe && unsubscribe();
    }
  }, [chatId, fetchMessages]);

  // Fetch the other user's data
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

  // Fetch user profiles for each message sender
  useEffect(() => {
    const fetchMessageProfiles = async () => {
      const profiles = {};
      for (const message of messages) {
        if (!profiles[message.senderId]) {
          profiles[message.senderId] = await getUserById(message.senderId);
        }
      }
      setMessageProfiles(profiles);
    };

    if (messages.length > 0) {
      fetchMessageProfiles();
    }
  }, [messages, getUserById]);

  // Handle clicks outside the emoji picker to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Scroll to the latest message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle image click to open modal
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalVisible(true);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // Upload images and send message
  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const uploadPromises = selectedFiles.map((file) => upload(file));
      const uploadedImages = await Promise.all(uploadPromises);

      const imageUrls = uploadedImages
        .map((response) => response.data?.path)
        .filter((url) => url);

      if (imageUrls.length > 0) {
        await sendMessage(chatId, newMessage || "", imageUrls);
        setNewMessage("");
      }

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (e) {
      console.error("Failed to upload images:", e);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      await handleImageUpload();
    } else if (newMessage.trim()) {
      await sendMessage(chatId, newMessage);
      setNewMessage("");
    }
  };

  // Handle additional file selection
  const handleMoreFilesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const urlToRevoke = prevPreviews[index];
      URL.revokeObjectURL(urlToRevoke);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  // Navigate to user profile
  const handleProfileClick = (profileUserId, profileUsername) => {
    if (profileUserId === userId) {
      navigate(`/profile/${currentUsername}`);
    } else {
      navigate(`/profile/${profileUsername}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 sticky top-0 z-10 w-full">
        <div
          className="flex items-center cursor-pointer  "
          onClick={() => handleProfileClick(otherUser?.id, otherUser?.username)}
        >
          <Avatar
            src={otherUser?.profile_url || "/defaultProfile.webp"}
            alt={otherUser?.username || "User"}
            className="mr-3 cursor-pointer"
          />
          <div>
            <h2 className="text-lg font-semibold text-white">
              {otherUser?.username || "User"}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === userId;
              const senderProfile = messageProfiles[message.senderId];
              const isLastMessage = index === messages.length - 1;
              return (
                <div
                  key={message.id}
                  ref={isLastMessage ? lastMessageRef : null}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <Tooltip
                    title={
                      message.timestamp
                        ? format(message.timestamp.toDate(), "PPpp")
                        : ""
                    }
                    placement="top"
                    arrow
                  >
                    <div
                      className={`flex items-end max-w-xs sm:max-w-sm ${
                        isOwnMessage ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        src={
                          senderProfile?.profile_url || "/defaultProfile.webp"
                        }
                        alt={senderProfile?.username || "User"}
                        className="w-10 h-10 sm:w-8 sm:h-8 cursor-pointer"
                        onClick={() =>
                          handleProfileClick(
                            message.senderId,
                            senderProfile?.username
                          )
                        }
                      />
                      <div
                        className={`${
                          isOwnMessage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-white"
                        } p-3 rounded-lg mx-2`}
                      >
                        {/* Display images if any */}
                        {Array.isArray(message.images) &&
                          message.images.length > 0 && (
                            <div className="flex flex-col gap-2 mb-2">
                              {message.images.map((imageUrl, idx) => (
                                <img
                                  key={idx}
                                  src={imageUrl}
                                  alt={`Sent ${idx}`}
                                  className="rounded-lg cursor-pointer"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    width: "auto",
                                    height: "auto",
                                  }}
                                  onClick={() => handleImageClick(imageUrl)}
                                />
                              ))}
                            </div>
                          )}
                        {/* Display text if any */}
                        {message.text && (
                          <p className="text-sm break-all">{message.text}</p>
                        )}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Start the conversation by sending a message.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="image-modal"
        aria-describedby="modal-to-display-full-image"
        className="flex items-center justify-center"
      >
        <Box className="outline-none">
          <img
            src={modalImageUrl}
            alt="Full Size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </Box>
      </Modal>

      {/* Input Section */}
      <div className="bg-gray-900 p-4 bottom-0 sticky shadow-md">
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-gray-900 text-white rounded-full p-1"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            ))}
            <IconButton
              color="primary"
              component="label"
              className="flex-shrink-0"
            >
              <PhotoCamera className="text-white" />
              <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleMoreFilesChange}
                style={{ display: "none" }}
              />
            </IconButton>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="relative">
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotionsIcon
                sx={{ color: showEmojiPicker ? "yellow" : "white" }}
              />
            </IconButton>
            {showEmojiPicker && (
              <div
                className="absolute bottom-full mb-2 left-0 z-50"
                ref={emojiPickerRef}
              >
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <IconButton color="primary" component="label">
            <PhotoCamera className="text-white" />
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleMoreFilesChange}
              style={{ display: "none" }}
            />
          </IconButton>

          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            multiline
            variant="outlined"
            className="flex-grow"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                backgroundColor: "#2D3748",
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px",
                maxHeight: "100px",
                overflow: "auto",
                color: "white",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A5568",
              },
            }}
            InputProps={{
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    // Shift + Enter: Add a new line
                    return;
                  } else {
                    // Enter without Shift: Send the message
                    e.preventDefault();
                    handleSendMessage();
                  }
                }
              },
            }}
          />

          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            className="ml-2"
          >
            {selectedFiles.length > 0 ? "Send Images" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
