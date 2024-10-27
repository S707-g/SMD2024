import { useState, useEffect, useCallback, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";
import AuthContext from "../context/AuthContext";
import useUser from "./useUser";

const useChat = () => {
  const { userId } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const { getUserById } = useUser();

  // Fetch all chats for the current user
  const fetchChats = useCallback(() => {
    if (!userId) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("users", "array-contains", userId),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const data = chatDoc.data();
        const chatId = chatDoc.id;
        const otherUserId = data.users.find((id) => id !== userId);
        const otherUserData = await getUserById(otherUserId);

        return {
          id: chatId,
          ...data,
          otherUser: otherUserData,
        };
      });

      const chatsData = await Promise.all(chatPromises);
      setChats(chatsData);
    });

    return unsubscribe;
  }, [userId, getUserById]);

  // Create or fetch an existing chat between two users
  const getOrCreateChat = useCallback(
    async (otherUserId) => {
      if (!userId || !otherUserId) return null;

      const chatsRef = collection(db, "chats");
      const existingChatQuery = query(
        chatsRef,
        where("users", "array-contains", userId)
      );
      const querySnapshot = await getDocs(existingChatQuery);

      let chatId = null;
      querySnapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        if (
          chatData.users.includes(userId) &&
          chatData.users.includes(otherUserId)
        ) {
          chatId = chatDoc.id;
        }
      });

      if (!chatId) {
        const newChatRef = await addDoc(chatsRef, {
          users: [userId, otherUserId],
          lastMessage: "",
          lastMessageTimestamp: Timestamp.now(), // Set to current timestamp
        });
        chatId = newChatRef.id;
      }

      return chatId;
    },
    [userId]
  );

  // Fetch messages for a specific chat
  const fetchMessages = useCallback((chatId) => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched messages:", msgs);
      setMessages(msgs);
    });

    return unsubscribe;
  }, []);

  // Send a message in a specific chat
  const sendMessage = async (chatId, text, images = []) => {
    const messageData = {
      senderId: userId,
      text,
      timestamp: Timestamp.now(),
    };

    // Include images if they exist
    if (images.length > 0) {
      messageData.images = images;
    }

    // Save the message to the database
    await addDoc(collection(db, "chats", chatId, "messages"), messageData);

    // Update the chat's last message and timestamp
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: Timestamp.now(),
    });
  };

  return {
    chats,
    messages,
    fetchChats,
    fetchMessages,
    sendMessage,
    getOrCreateChat,
  };
};

export default useChat;
