import React, { useState } from "react";
import { apiClient } from "../../API/urlApi";

interface User {
  id: number;
  userName: string;
  email?: string;
}

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<User[]>(
        `/user/search?userName=${encodeURIComponent(query)}`
      );
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId: number) => {
    try {
      await apiClient.post("/friendship/request", { friendId });
      alert("Friend request sent!");
      setResults(results.filter((user) => user.id !== friendId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Find Friends</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter username"
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.userName}</p>
              {user.email && (
                <p className="text-sm text-gray-600">{user.email}</p>
              )}
            </div>
            <button
              onClick={() => handleSendRequest(user.id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add Friend
            </button>
          </div>
        ))}

        {results.length === 0 && !loading && query && (
          <p className="text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
