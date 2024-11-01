import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";

const useLikes = () => {
  // Function to check if a post is liked by a user
  const isPostLikedByUser = async (postId, userId) => {
    const q = query(
      collection(db, "useLikes"),
      where("postId", "==", postId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Return the ID of the like document
      return querySnapshot.docs[0].id;
    }
    return null;
  };

  // Function to like a post
  const likePost = async (postId, userId) => {
    // Check if the user has already liked the post
    const existingLikeId = await isPostLikedByUser(postId, userId);
    if (!existingLikeId) {
      await addDoc(collection(db, "useLikes"), {
        postId,
        userId,
      });
    }
  };

  // Function to unlike a post
  const unlikePost = async (postId, userId) => {
    const q = query(
      collection(db, "useLikes"),
      where("postId", "==", postId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((likeDoc) => {
      deleteDoc(doc(db, "useLikes", likeDoc.id));
    });
  };

  // Function to get likes count for a post
  const getLikesCount = async (postId) => {
    const q = query(collection(db, "useLikes"), where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };
  const deleteLikesForPost = async (postId) => {
    try {
      const likesQuery = query(
        collection(db, "likes"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(likesQuery);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting likes:", error);
      throw error;
    }
  };

  return {
    isPostLikedByUser,
    likePost,
    unlikePost,
    getLikesCount,
    deleteLikesForPost,
  };
};

export default useLikes;
