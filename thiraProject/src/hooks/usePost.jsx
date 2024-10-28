import { useState, useEffect } from "react";
import {
  where,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc")); // Order by createdAt descending
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchBookmarkedPosts = async (userId) => {
    try {
      const postsRef = collection(db, "posts");
      const bookmarkedPostsQuery = query(postsRef, where("bookmarkedBy", "array-contains", userId)); // Adjust "bookmarkedBy" if necessary
      const querySnapshot = await getDocs(bookmarkedPostsQuery);
      const bookmarkedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return bookmarkedPosts;
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
      return [];
    }
  };

  // Add a new post
  const addPost = async (newPost) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      setPosts((prev) => [...prev, { id: docRef.id, ...newPost }]);
      return docRef;
    } catch (err) {
      setError(err.message);
      return err;
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
  const updatePost = async (postId, updatedData) => {
    // Remove any undefined fields from updatedData
    const sanitizedData = {};
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined) {
        sanitizedData[key] = updatedData[key];
      }
    });

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, sanitizedData);
  };

  return {
    posts,
    loading,
    error,
    addPost,
    getPost,
    deletePost,
    updatePost,
    fetchPosts,
    fetchBookmarkedPosts,
  };
};

export default usePosts;
