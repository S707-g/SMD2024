// Friends.jsx
import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import FriendCard from "./FriendCard";

const Friends = () => {
  const { fetchAllUsers, fetchFriends, currentUser } = useUser();
  const [friends, setFriends] = useState([]);
  const [nonFriends, setNonFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(currentUser.uid, friendId); // Define `addFriend` in `useUser.js`
      setFriends((prev) => [...prev, nonFriends.find((user) => user.id === friendId)]);
      setNonFriends((prev) => prev.filter((user) => user.id !== friendId));
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };
  
  useEffect(() => {
    if (currentUser && !loading) {  // Ensure currentUser is loaded
      const loadUsers = async () => {
        try {
          const userFriends = await fetchFriends(currentUser.uid);
          const allUsers = await fetchAllUsers();
          const friendIds = new Set(userFriends.map((friend) => friend.id));
          const nonFriendUsers = allUsers.filter((user) => !friendIds.has(user.id) && user.id !== currentUser.uid); // Exclude self
  
          setFriends(userFriends);
          setNonFriends(nonFriendUsers);
        } catch (error) {
          console.error("Error loading users:", error);
        } finally {
          setLoading(false);
        }
      };
      loadUsers();
    }
  }, [currentUser, loading, fetchFriends, fetchAllUsers]);
  
  useEffect(() => {
    const loadUsers = async () => {
      
      try {
        const userId = "currentUser";
        console.log(userId)
        const userFriends = await fetchFriends(userId);
        const allUsers = await fetchAllUsers();

        const friendIds = new Set(userFriends.map((friend) => friend.id));
        const nonFriendUsers = allUsers.filter((user) => !friendIds.has(user.id));

        setFriends(userFriends);
        setNonFriends(nonFriendUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [fetchFriends, fetchAllUsers]);

  return (
    <div className="friends-list p-4">
      {loading ? (
        <p>Loading friends...</p>
      ) : (
        <>
          <div className="friends-section mb-6">
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            {friends.length > 0 ? (
              <ul className="space-y-4">
                {friends.map((friend) => (
                  <FriendCard key={friend.id} user={friend} onClick={() => console.log("Friend clicked:", friend.id)} />
                ))}
              </ul>
            ) : (
              <p>No friends found.</p>
            )}
          </div>

          <div className="add-friends-section">
            <h2 className="text-xl font-semibold mb-4">Add Friends</h2>
            {nonFriends.length > 0 ? (
              <ul className="space-y-4">
                {nonFriends.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
                    <FriendCard user={user} onClick={() => console.log("User clicked:", user.id)} />
                    <button className="bg-blue-500 text-white rounded-md px-3 py-1" onClick={() => handleAddFriend(user.id)}>
                      Add Friend
                    </button>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No users available to add.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Friends;
