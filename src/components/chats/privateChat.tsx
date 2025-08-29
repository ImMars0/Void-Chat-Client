import React, { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useLocation } from "react-router-dom";
import type LocationState from "../../types/LocationState";

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

const PrivateChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendStatus, setFriendStatus] = useState<FriendStatus>({
    isOnline: false,
    lastActive: null,
  });
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<signalR.HubConnection | null>(null);

  const location = useLocation();
  const { currentUserId, friendId, friendUsername } =
    (location.state as LocationState) || {};

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!currentUserId || !friendId) return;

    const hub = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7124/privateChatHub", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    hubRef.current = hub;

    hub.start().then(async () => {
      setIsConnected(true);
    });

    hub.on("ReceiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    hub.on("UpdateFriendStatus", (status: FriendStatus) => {
      setFriendStatus(status);
    });

    hub.onclose(() => setIsConnected(false));

    return () => {
      hub.stop();
    };
  }, [currentUserId, friendId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !friendId) return;
    const hub = hubRef.current;
    if (!hub || hub.state !== signalR.HubConnectionState.Connected) return;

    try {
      await hub.invoke("SendPrivateMessage", friendId, newMessage.trim());

      const msg: Message = {
        id: Date.now(),
        senderId: currentUserId,
        receiverId: friendId,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      scrollToBottom();
    } catch {}
  };

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
              <strong>{msg.sender?.userName || "You"}: </strong>
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          style={{
            padding: "8px 16px",
            backgroundColor:
              !newMessage.trim() || !isConnected ? "#ccc" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor:
              !newMessage.trim() || !isConnected ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;
