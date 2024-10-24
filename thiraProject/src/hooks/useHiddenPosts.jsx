import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import db from "../database/FirebaseConfig";

const useHiddenPosts = () => {
  const addPostToHiddenPosts = async (userId, postId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      hiddenPosts: arrayUnion(postId),
    });
  };

  const getHiddenPosts = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.hiddenPosts || [];
    } else {
      return [];
    }
  };

  return { addPostToHiddenPosts, getHiddenPosts };
};

export default useHiddenPosts;
