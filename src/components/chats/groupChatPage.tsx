import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const GroupChatPage: React.FC = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState("Disconnected");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || connectionRef.current) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7124/groupChatHub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = hubConnection;

    hubConnection.onclose(() => setConnectionState("Disconnected"));
    hubConnection.onreconnecting(() => setConnectionState("Reconnecting"));
    hubConnection.onreconnected(() => setConnectionState("Connected"));

    hubConnection.on("ReceiveMessage", (messageData: any) => {
      const messageText =
        typeof messageData === "object"
          ? `User ${messageData.senderId}: ${messageData.content}`
          : messageData;
      setMessages((prev) => [...prev, messageText]);
    });

    hubConnection.on("OnlineUsersCount", (count: number) => {
      setOnlineUsers(count);
    });

    const startConnection = async () => {
      hubConnection
        .start()
        .then(() => setConnectionState("Connected"))
        .catch((err) => console.error("Initial connection failed:", err));
    };

    startConnection();

    return () => {
      hubConnection.stop();
      connectionRef.current = null;
    };
  }, [userId]);

  const sendMessage = async () => {
    const connection = connectionRef.current;
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected ||
      !input.trim()
    ) {
      console.warn("Cannot send message - connection not ready");
      return;
    }

    try {
      await connection.invoke("SendMessage", input);
      setInput("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  if (!userId) return <div>Please log in to chat</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat (Status: {connectionState})</h2>
      <div>Online: {onlineUsers}</div>

      <div
        style={{
          height: 200,
          border: "1px solid #ccc",
          overflowY: "auto",
          margin: "10px 0",
          padding: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ marginRight: 10 }}
          disabled={connectionState !== "Connected"}
        />
        <button
          onClick={sendMessage}
          disabled={connectionState !== "Connected"}
        >
          {connectionState === "Connected" ? "Send" : "Connecting..."}
        </button>
      </div>
    </div>
  );
};

export default GroupChatPage;
