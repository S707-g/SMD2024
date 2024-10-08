import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import db from "../database/FirebaseConfig";

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  return {
    users,
    loading,
    error,
    addUser,
    getUser,
    deleteUser,
    updateUser,
  };
};

export default useUser;
