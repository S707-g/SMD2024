import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  onSnapshot,
} from "firebase/firestore";
import db from "../database/FirebaseConfig";
import useUser from "./useUser";

const useComments = () => {
  const { getUserById } = useUser();
  // Function to add a comment to a post
  const addComment = async (postId, userId, text) => {
    await addDoc(collection(db, "comments"), {
      postId,
      userId,
      text,
      createdAt: Timestamp.now(),
    });
  };

  // Function to fetch comments for a specific post
  const fetchCommentsForPost = async (postId) => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return []; // Return an empty array if no comments
    }
    const comments = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const commentData = { id: doc.id, ...doc.data() };
        // Fetch username
        const user = await getUserById(commentData.userId);
        commentData.username = user?.username || "Unknown User";
        return commentData;
      })
    );
    return comments;
  };

  return {
    addComment,
    fetchCommentsForPost,
  };
};

export default useComments;
