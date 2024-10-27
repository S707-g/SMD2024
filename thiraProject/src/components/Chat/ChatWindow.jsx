import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  ListItemText,
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
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const emojiPickerRef = useRef(null);
  const navigate = useNavigate();
  const lastMessageRef = useRef(null);

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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl); // Set the image URL
    setModalVisible(true); // Open the modal
  };

  const handleMouseEnter = (timestamp, event) => {
    setHoveredMessageTimestamp(timestamp);
    setTimestampModalVisible(true);
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top - 40,
      left: rect.left + rect.width / 2,
    });
  };

  const handleMouseLeave = () => {
    setTimestampModalVisible(false);
  };

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

  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      await handleImageUpload();
    } else if (newMessage.trim()) {
      await sendMessage(chatId, newMessage);
      setNewMessage("");
    }
  };

  const handleMoreFilesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const urlToRevoke = prevPreviews[index];
      URL.revokeObjectURL(urlToRevoke);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleProfileClick = (profileUserId, profileUsername) => {
    if (profileUserId === userId) {
      navigate(`/profile/${currentUsername}`);
    } else {
      navigate(`/profile/${profileUsername}`);
    }
  };

  return (
    <>
      <h2
        className="text-lg font-semibold mb-2 sticky top-0 bg-gray-800 p-4 z-10 flex justify-between items-center"
        style={{ height: "64px" }}
      >
        <div>
          <span className="text-gray-200">Chat with </span>{" "}
          <span
            onClick={() =>
              handleProfileClick(otherUser?.id, otherUser?.username)
            }
            className="cursor-pointer text-blue-400"
          >
            {otherUser?.username || "User"}
          </span>
        </div>
        <div>
          <IconButton
            color="primary"
            onClick={() => handleCallClick(otherUser?.id)}
            className="ml-4"
          >
            <CallIcon />
          </IconButton>
        </div>
      </h2>

      <div className="pt-4 px-3 flex flex-col h-[calc(100vh-128px)] bg-gray-800">
        <div className="overflow-y-auto flex-grow my-3 p-4 scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-gray-800 w-full">
          <div className="space-y-3">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === userId;
              const isLastMessage = index === messages.length - 1;
              return (
                <div
                  key={message.id}
                  ref={isLastMessage ? lastMessageRef : null}
                  className={`group flex ${
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
                      className={`flex items-end ${
                        isOwnMessage ? "flex-row" : "flex-row"
                      } max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]`}
                    >
                      {/* Existing message content */}
                      <div
                        className={`${
                          isOwnMessage
                            ? "bg-gray-300 text-black text-right order-1"
                            : "bg-gray-500 text-left text-white order-2"
                        } p-2 rounded-lg max-w-full break-words text-sm relative`}
                        style={{ marginRight: isOwnMessage ? "0.5rem" : "0" }}
                      >
                        {Array.isArray(message.images) &&
                          message.images.length > 0 && (
                            <div
                              className={`flex flex-col gap-2 ${
                                isOwnMessage ? "items-end" : "items-start"
                              }`}
                            >
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
                        {message.text && (
                          <ListItemText primary={message.text} />
                        )}
                      </div>
                      <Avatar
                        src={
                          isOwnMessage
                            ? "/myAvatar.png"
                            : otherUser?.profile_url || "/defaultProfile.webp"
                        }
                        alt="User Avatar"
                        className={`m-1 cursor-pointer w-10 h-10 sm:w-8 sm:h-8 ${
                          isOwnMessage ? "order-2" : ""
                        }`}
                        onClick={() =>
                          handleProfileClick(
                            isOwnMessage ? userId : otherUser?.id,
                            isOwnMessage ? currentUsername : otherUser?.username
                          )
                        }
                        style={{
                          marginLeft: isOwnMessage ? "0.5rem" : "0",
                          marginRight: !isOwnMessage ? "0.5rem" : "0",
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>

        {/* modal for full image */}
        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          aria-labelledby="image-modal"
          aria-describedby="modal-to-display-full-image"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none", // Remove any outline from the modal
          }}
        >
          <Box
            sx={{
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              outline: "none", // Remove any outline from the Box
              border: "none", // Ensure no border is present
            }}
          >
            <img
              src={modalImageUrl}
              alt="Full Size"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </Box>
        </Modal>

        {/* Sticky Input Section */}
        <div
          className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-300 w-full flex flex-col items-center space-y-2"
          style={{ height: "64px" }} // Set a fixed height for the input section
        >
          {imagePreviews.length > 0 && (
            <div className="w-full flex gap-2 overflow-x-auto p-2 bg-gray-600 rounded-md">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}
              {/* Add the button to upload more images */}
              <IconButton
                color="primary"
                component="label"
                className="flex-shrink-0"
              >
                <PhotoCamera />
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleMoreFilesChange} // New handler function for additional files
                  style={{ display: "none" }}
                />
              </IconButton>
            </div>
          )}

          {/* Input and Controls */}
          <div className="w-full flex items-center space-x-2 ">
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotionsIcon />
            </IconButton>
            {showEmojiPicker && (
              <div
                className="absolute bottom-16 left-4 bg-white shadow-lg rounded-lg z-10 p-2"
                ref={emojiPickerRef}
              >
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            {/* Image Upload Input and Icon */}
            <IconButton color="primary" component="label">
              <PhotoCamera />
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
              fullWidth
              multiline
              variant="outlined"
              className="bg-gray-100 rounded-lg"
              InputProps={{
                style: {
                  padding: "10px",
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
    </>
  );
};

export default ChatWindow;
