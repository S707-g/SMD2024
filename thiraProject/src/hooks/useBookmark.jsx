import { useCallback } from "react";
import { toggleBookmark } from "../components/bookmarkPage/bookmarkUtils"; // Adjust path as necessary

/**
 * Custom hook for managing bookmark actions.
 * @returns {Function} - A function to toggle bookmarks for a post.
 */
const useBookmark = () => {
  /**
   * Toggles the bookmark state of a post for a specific user.
   * @param {string} postId - The ID of the post to bookmark or unbookmark.
   * @param {string} userId - The ID of the user performing the action.
   * @returns {boolean|null} - Returns true if bookmarked, false if unbookmarked, or null on error.
   */
  const togglePostBookmark = useCallback(async (postId, userId) => {
    return await toggleBookmark(postId, userId);
  }, []);

  return { togglePostBookmark };
};

export default useBookmark;
