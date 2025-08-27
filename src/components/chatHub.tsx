import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const ChatHub: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [input, setInput] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7124/chatHub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    hubConnection.on("ReceiveMessage", (user: string, message: string) => {
      setMessages((prev) => [...prev, `${user}: ${message}`]);
    });

    hubConnection.on("OnlineUsersCount", (count: number) => {
      setOnlineUsers(count);
    });

    const startConnection = async () => {
      try {
        await hubConnection.start();
        setConnection(hubConnection);
      } catch (err) {
        console.error("Connection error:", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (hubConnection.state === signalR.HubConnectionState.Connected) {
        hubConnection.stop();
      }
    };
  }, [userId]);

  console.log("User ID:", userId);

  const sendMessage = async () => {
    if (!connection || !input.trim()) return;

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
      <h2>Chat</h2>
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
        />
        <button onClick={sendMessage} disabled={!connection}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatHub;
