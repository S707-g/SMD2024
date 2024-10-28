// Import necessary Firestore functions
import { collection, doc, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import db from "../../database/FirebaseConfig"; // Adjust path as necessary

/**
 * Toggles the bookmark state for a specific post by a specific user.
 * @param {string} postId - The ID of the post to bookmark or unbookmark.
 * @param {string} userId - The ID of the user performing the action.
 * @returns {boolean|null} - Returns true if bookmarked, false if unbookmarked, or null on error.
 */
export const toggleBookmark = async (postId, userId) => {
  try {
    const bookmarksRef = collection(db, "bookmarks");
    const bookmarkQuery = query(bookmarksRef, where("postId", "==", postId), where("bookmarkedBy", "==", userId));
    const querySnapshot = await getDocs(bookmarkQuery);

    if (!querySnapshot.empty) {
      // Bookmark exists, so remove it
      const bookmarkDocId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "bookmarks", bookmarkDocId));
      return false; // Unbookmarked
    } else {
      // Bookmark doesn't exist, so add it
      await addDoc(bookmarksRef, { postId, bookmarkedBy: userId });
      return true; // Bookmarked
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return null;
  }
};
