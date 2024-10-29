// Friends.jsx
import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import FriendCard from "./FriendCard";

const Friends = () => {
  const { fetchAllUsers } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [fetchAllUsers]);

  const handleUserClick = (userId) => {
    console.log("User clicked:", userId);
  };

  return (
    <div className="friends-list p-4">
      {loading ? (
        <p>Loading friends...</p>
      ) : users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <FriendCard key={user.id} user={user} onClick={handleUserClick} />
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default Friends;
