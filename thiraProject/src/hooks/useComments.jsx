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

    const comments = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const commentData = { id: doc.id, ...doc.data() };

        // Fetch user data
        const user = await getUserById(commentData.userId);
        commentData.username = user?.username || "Unknown User";
        commentData.profilePic = user?.profile_url || "/defaultProfile.webp";

        // Convert Firestore Timestamp to JavaScript Date
        if (commentData.createdAt && commentData.createdAt.toDate) {
          commentData.createdAt = commentData.createdAt.toDate();
        } else {
          commentData.createdAt = new Date(); // Fallback to current date
        }

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
