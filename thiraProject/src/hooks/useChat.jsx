import { useState, useEffect, useCallback, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";
import AuthContext from "../context/AuthContext"; // Ensure AuthContext is properly imported
import useUser from "./useUser";

const useChat = () => {
  const { userId } = useContext(AuthContext); // Access the current user ID
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const { getUserById } = useUser(); // Assuming this retrieves user data

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
      const chatPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const chatId = doc.id;
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
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (
          chatData.users.includes(userId) &&
          chatData.users.includes(otherUserId)
        ) {
          chatId = doc.id; // Chat already exists
        }
      });

      if (!chatId) {
        const newChatRef = await addDoc(chatsRef, {
          users: [userId, otherUserId],
          lastMessage: "",
          lastMessageTimestamp: null,
        });
        chatId = newChatRef.id;
      }

      return chatId;
    },
    [userId]
  );

  // Fetch messages for a specific chat
  const fetchMessages = useCallback((chatId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, []);

  // Send a message in a specific chat
  const sendMessage = useCallback(
    async (chatId, messageText) => {
      if (!messageText.trim()) return;

      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: userId,
        text: messageText,
        timestamp: Timestamp.now(),
      });

      // Update the chat's last message
      const chatDocRef = doc(db, "chats", chatId);
      await updateDoc(chatDocRef, {
        lastMessage: messageText,
        lastMessageTimestamp: Timestamp.now(),
      });
    },
    [userId]
  );

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
