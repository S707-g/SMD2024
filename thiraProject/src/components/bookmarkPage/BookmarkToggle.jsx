import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { doc, collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AuthContext from "../../context/AuthContext";
import db from "../../database/FirebaseConfig";

const BookmarkToggle = ({ postId, initialBookmarked = false, onToggle }) => {
  const { userId, isAuthenticated } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert("Please log in to bookmark posts.");
      return;
    }

    try {
      const bookmarksRef = collection(db, "bookmarks");
      const bookmarkQuery = query(bookmarksRef, where("postId", "==", postId), where("bookmarkedBy", "==", userId));
      const querySnapshot = await getDocs(bookmarkQuery);

      if (!querySnapshot.empty) {
        // Remove the bookmark if it already exists
        const bookmarkDocId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "bookmarks", bookmarkDocId));
        setIsBookmarked(false);
        if (onToggle) onToggle(false);
      } else {
        // Add a new bookmark
        await addDoc(bookmarksRef, { postId, bookmarkedBy: userId });
        setIsBookmarked(true);
        if (onToggle) onToggle(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div onClick={handleBookmarkToggle} className="cursor-pointer hover:text-yellow-500 flex items-center">
      {isBookmarked ? (
        <BookmarkIcon className="text-yellow-500" />
      ) : (
        <BookmarkBorderIcon className="gap-3 flex hover:text-gray-500" />
      )}
    </div>
  );
};

// Prop validation
BookmarkToggle.propTypes = {
  postId: PropTypes.string.isRequired, // postId must be a string and is required
  initialBookmarked: PropTypes.bool,   // initialBookmarked is a boolean, not required (default is false)
  onToggle: PropTypes.func             // onToggle should be a function, optional
};

export default BookmarkToggle;
