import React, { useEffect, useState } from "react";
import { apiClient } from "../../API/urlApi";

interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  friendUsername: string;
  status: string;
  createdAt: string;
}

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get<Friendship[]>(
        "/friendships/pending"
      );
      setRequests(response.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (friendshipId: number, accept: boolean) => {
    if (
      !accept &&
      !window.confirm("Are you sure you want to decline this request?")
    ) {
      return;
    }

    try {
      await apiClient.post("/friendships/respond", { friendshipId, accept });
      alert(accept ? "Friend request accepted!" : "Friend request declined.");
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to respond to request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="p-4">Loading requests...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending friend requests</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{request.friendUsername}</p>
                  <p className="text-sm text-gray-600">
                    Sent {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => respondToRequest(request.id, true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(request.id, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
