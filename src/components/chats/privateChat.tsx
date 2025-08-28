import React, { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "../../API/urlApi";
import { useLocation } from "react-router-dom";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender?: { userName?: string };
}

interface FriendStatus {
  isOnline: boolean;
  lastActive: string | null;
}

interface LocationState {
  currentUserId: number;
  friendId: number;
  friendUsername: string;
}

const PrivateChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>({
    isOnline: false,
    lastActive: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { currentUserId, friendId, friendUsername } =
    (location.state as LocationState) || {};

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const markMessagesAsRead = useCallback(
    async (msgs: Message[]) => {
      if (!currentUserId) return;

      const unreadMessages = msgs.filter(
        (m) => !m.isRead && m.receiverId === currentUserId
      );

      for (const msg of unreadMessages) {
        try {
          await apiClient.put(`/chats/markAsRead/${msg.id}`);
        } catch {
          console.error("Failed to mark message as read", msg.id);
        }
      }
    },
    [currentUserId]
  );

  const loadConversation = useCallback(async () => {
    if (!currentUserId || !friendId) return;

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<Message[]>(
        `/chats/conversation?user1=${currentUserId}&user2=${friendId}`
      );
      setMessages(res.data);
      await markMessagesAsRead(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, friendId, markMessagesAsRead]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !friendId) return;

    try {
      setError(null);
      await apiClient.post("/chats", {
        senderId: currentUserId,
        receiverId: friendId,
        content: newMessage.trim(),
        isRead: false,
      });

      setNewMessage("");
      await loadConversation();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const fetchFriendStatus = useCallback(async () => {
    if (!friendId) return;
    try {
      const res = await apiClient.get<FriendStatus>(`/user/status/${friendId}`);
      setFriendStatus({
        isOnline: res.data.isOnline,
        lastActive: res.data.lastActive,
      });
    } catch (err) {
      console.error("Failed to fetch friend status");
    }
  }, [friendId]);

  useEffect(() => {
    loadConversation();
    fetchFriendStatus();
  }, [loadConversation, fetchFriendStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (!currentUserId || !friendId) {
    return <div>Error: Missing user information</div>;
  }

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return "";
    return `(Last seen: ${new Date(lastActive).toLocaleString()})`;
  };

  return (
    <div className="private-chat" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>
        Chat with {friendUsername || "Friend"}{" "}
        <span style={{ fontSize: 12, color: "#666" }}>
          {friendStatus.isOnline
            ? "(Online)"
            : formatLastActive(friendStatus.lastActive)}
        </span>
      </h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div
        className="messages-container"
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {loading && <div>Loading messages...</div>}
        {!loading && messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#666" }}>
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === currentUserId ? "right" : "left",
              marginBottom: 10,
              padding: 8,
              backgroundColor:
                msg.senderId === currentUserId ? "#191a1aff" : "#f5f5f5",
              borderRadius: 8,
              marginLeft: msg.senderId === currentUserId ? "20%" : "0",
              marginRight: msg.senderId === currentUserId ? "0" : "20%",
            }}
          >
            <div>
              <strong>{msg.sender?.userName || "Unknown"}: </strong>
              {msg.content}
            </div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.senderId === currentUserId && (
                <span style={{ marginLeft: 5 }}>{msg.isRead ? "✓✓" : "✓"}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !newMessage.trim()}
          style={{
            padding: "8px 16px",
            backgroundColor: loading || !newMessage.trim() ? "#ccc" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading || !newMessage.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;
