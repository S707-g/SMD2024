import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import db from "../database/FirebaseConfig";

const auth = getAuth();

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (err, message) => {
    console.error(message, err);
    setError(message);
  };
  
  // Listen for authentication state changes and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ uid: user.uid, ...userDoc.data() });
          }
        } catch (error) {
          handleError(error, "Error fetching user data");
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const usersCollection = collection(db, "users"); // adjust the collection name if needed
      const querySnapshot = await getDocs(usersCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      handleError(err, "Error fetching all users");
      return [];
    }
  }, []);
  
  

  const getUserById = useCallback(async (userId) => {
    const cachedUser = users.find((user) => user.id === userId);
    if (cachedUser) return cachedUser;

    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        const userData = { id: docSnap.id, ...docSnap.data() };
        setUsers((prev) => [...prev, userData]);
        return userData;
      } else {
        console.error(`No user found for userId: ${userId}`);
        return null;
      }
    } catch (err) {
      handleError(err, "Error fetching user by ID");
      return null;
    }
  }, [users]);

  const getUserByUsername = useCallback(async (username) => {
    const cachedUser = users.find((user) => user.username === username);
    if (cachedUser) return cachedUser;

    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        setUsers((prev) => [...prev, userData]);
        return userData;
      } else {
        console.error("No user with that username found!");
        return null;
      }
    } catch (err) {
      handleError(err, "Error fetching user by username");
      return null;
    }
  }, [users]);

  const addUser = async (newUser) => {
    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      setUsers((prev) => [...prev, { id: docRef.id, ...newUser }]);
    } catch (err) {
      handleError(err, "Error adding user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      handleError(err, "Error deleting user");
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "users", id), updatedData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...updatedData } : user))
      );
    } catch (err) {
      handleError(err, "Error updating user");
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const friendsCollection = collection(db, "friends");
      const q = query(friendsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUsers([]);
    } catch (err) {
      handleError(err, "Error signing out");
    }
  };

  const getUsernamesByPartialMatch = useCallback(async (partialUsername) => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", ">=", partialUsername),
        where("username", "<=", partialUsername + '\uf8ff') // Use unicode for range
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        return []; // No matches found
      }
    } catch (err) {
      handleError(err, "Error fetching usernames by partial match");
      return [];
    }
  }, []);

  return {
    users,
    currentUser,
    loading,
    error,
    addUser,
    getUserById,
    deleteUser,
    updateUser,
    signOutUser,
    getUserByUsername,
    getUsernamesByPartialMatch,
    fetchAllUsers,
    fetchFriends,
  };
};

export default useUser;
