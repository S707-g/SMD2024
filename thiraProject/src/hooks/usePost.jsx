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
  where,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";

const usePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postCollection = collection(db, "posts");
        const postSnapshot = await getDocs(postCollection);
        const postList = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Add a new post
  const addPost = async (newPost) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      setPosts((prev) => [...prev, { id: docRef.id, ...newPost }]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get a single post by ID
  const getPost = async (id) => {
    try {
      const docRef = doc(db, "posts", id);
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

  // Delete a post by ID
  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing post by ID
  const updatePost = async (id, updatedData) => {
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, updatedData);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, ...updatedData } : post
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    posts,
    loading,
    error,
    addPost,
    getPost,
    deletePost,
    updatePost,
  };
};

export default usePost;
