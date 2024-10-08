import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query, 
  where
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import db from "../database/FirebaseConfig";

const auth = getAuth();

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch authenticated user's data
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUsers([{ id: userDoc.id, ...userDoc.data() }]);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Add a new user
  const addUser = async (newUser) => {
    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      setUsers((prev) => [...prev, { id: docRef.id, ...newUser }]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get a single user by ID
  const getUser = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document!");
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Delete a user by ID
  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing user by ID
  const updateUser = async (id, updatedData) => {
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, updatedData);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Sign out the current user
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUsers([]); // Clear users data on sign out
    } catch (err) {
      setError(err.message);
    }
  };

  const getUserByUsername = async (username) => {
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        throw new Error("No user with that username found!");
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    users,
    currentUser,
    loading,
    error,
    addUser,
    getUser,
    deleteUser,
    updateUser,
    signOutUser,
    getUserByUsername
  };
};

export default useUser;
