import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../API/urlApi";

interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  friendUsername: string;
  status: string;
  createdAt: string;
}

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await apiClient.get<Friendship[]>("/friendships");
      setFriends(response.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const startPrivateChat = (friend: Friendship) => {
    navigate("/privateChat", {
      state: {
        currentUserId,
        friendId: friend.friendId,
        friendUsername: friend.friendUsername,
      },
    });
  };

  const removeFriend = async (friendId: number) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      await apiClient.delete(`/friendships/${friendId}`);
      alert("Friend removed successfully");
      fetchFriends();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove friend");
    }
  };

  const blockUser = async (friendId: number) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;

    try {
      await apiClient.post(`/friendships/block/${friendId}`);
      alert("User blocked successfully");
      fetchFriends();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to block user");
    }
  };

  if (loading) return <div className="p-4">Loading friends...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Friends</h2>

      {friends.length === 0 ? (
        <p className="text-gray-500">You haven't added any friends yet</p>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="p-4 border rounded-lg shadow-sm">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => startPrivateChat(friend)}
              >
                <div>
                  <p className="font-semibold">{friend.friendUsername}</p>
                  <p className="text-sm text-gray-600">
                    Friends since{" "}
                    {new Date(friend.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => removeFriend(friend.friendId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                >
                  Remove
                </button>
                <button
                  onClick={() => blockUser(friend.friendId)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex-1"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
