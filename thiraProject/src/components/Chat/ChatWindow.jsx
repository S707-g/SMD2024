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
  Dialog,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // Icon for emoji picker
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import useChat from "../../hooks/useChat";
import useUser from "../../hooks/useUser";
import { useUpload } from "../../hooks/useUpload";
import db from "../../database/FirebaseConfig";
import Picker from "emoji-picker-react"; // Emoji picker component

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(""); // To store clicked image URL
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // To toggle emoji picker
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

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      // Upload all selected files
      const uploadPromises = selectedFiles.map((file) => upload(file));
      const uploadedImages = await Promise.all(uploadPromises);

      // Extract URLs from the uploaded images
      const imageUrls = uploadedImages
        .map((response) => response.data?.path) // Ensure this matches your upload response
        .filter((url) => url);
      console.log("Image URLs:", imageUrls);

      // Send message with image URLs if there are any
      if (imageUrls.length > 0) {
        await sendMessage(chatId, newMessage || "", imageUrls);
        setNewMessage(""); // Reset message text
      }

      // Revoke object URLs to free up memory
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      // Clear selected files and previews after upload
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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);

    // Create image previews to display
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    console.log("Selected files:", files);
    console.log("Image previews:", previews);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const urlToRevoke = prevPreviews[index];
      URL.revokeObjectURL(urlToRevoke);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  // Navigate to other user's profile or self profile
  const handleProfileClick = (profileUserId, profileUsername) => {
    if (profileUserId === userId) {
      navigate(`/profile/${currentUsername}`); // Navigate to self profile
    } else {
      navigate(`/profile/${profileUsername}`); // Navigate to other user's profile
    }
  };

  // Open the modal with the clicked image
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setModalImageUrl("");
  };

  // Handle emoji selection
  const handleEmojiClick = (event, emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold mb-2 sticky top-0 bg-gray-800 p-4 z-10">
        Chat with{" "}
        <span
          onClick={() => handleProfileClick(otherUser?.id, otherUser?.username)}
          className="cursor-pointer text-blue-500"
        >
          {otherUser?.username || "User"}
        </span>
      </h2>
      <div className="pt-4 px-3 max-w-full  flex flex-col h-screen bg-gray-800">
        {/* Chat Messages Container */}
        <div className="overflow-y-auto flex-grow my-3  p-4 scrollbar-thin scrollbar-thumb-scrollbar-thumb w-full">
          <div className="space-y-3 ">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === userId;
              const isLastMessage = index === messages.length - 1;
              return (
                <div
                  key={message.id}
                  ref={isLastMessage ? lastMessageRef : null}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    } max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]`}
                  >
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
                    />
                    {Array.isArray(message.images) &&
                    message.images.length > 0 ? (
                      <div
                        className={`flex flex-col gap-2 ${
                          isOwnMessage ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Display images */}
                        {message.images.map((imageUrl, idx) => (
                          <img
                            key={idx}
                            src={imageUrl}
                            alt={`Sent ${idx}`}
                            className="max-w-full h-auto rounded-lg cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                          />
                        ))}
                        {/* Display text if it exists */}
                        {message.text && (
                          <div
                            className={`${
                              isOwnMessage
                                ? "bg-gray-300 text-black text-right"
                                : "bg-gray-500 text-left text-white"
                            } p-2 rounded-lg max-w-full break-words text-sm`}
                          >
                            <ListItemText
                              primary={message.text}
                              secondary={new Date(
                                message.timestamp?.toDate()
                              ).toLocaleString()}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`${
                          isOwnMessage
                            ? "bg-gray-300 text-black text-right"
                            : "bg-gray-500 text-left text-white"
                        } p-2 rounded-lg max-w-full break-words text-sm`}
                      >
                        <ListItemText
                          primary={message.text}
                          secondary={new Date(
                            message.timestamp?.toDate()
                          ).toLocaleString()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Input Section */}
        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-300 w-full flex flex-col items-center space-y-2">
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
            </div>
          )}

          {/* Input and Controls */}
          <div className="w-full flex items-center space-x-2">
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
                onChange={handleFileChange}
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

        {/* Modal for displaying full-size image */}
        <Dialog open={modalVisible} onClose={handleCloseModal} maxWidth="lg">
          <div className="p-4">
            <img
              src={modalImageUrl}
              alt="Full Size"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
            <Button
              onClick={handleCloseModal}
              style={{ marginTop: "10px" }}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ChatWindow;
