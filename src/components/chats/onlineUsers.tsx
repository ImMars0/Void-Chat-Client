import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { apiClient } from "../../API/urlApi";

interface ActiveUsersListProps {
  currentUserId: number;
  onUserSelect: (userId: number) => void;
}

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({
  currentUserId,
  onUserSelect,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const hubUrl = `${apiClient.defaults.baseURL}/groupChatHub`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubUrl}?userId=${currentUserId}`, {
        withCredentials: true,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("OnlineUsersUpdated", (users: number[]) => {
      setOnlineUsers(users);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        setConnection(connection);
      } catch (err) {
        console.error("Connection error:", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [currentUserId]);

  return (
    <div className="active-users">
      <h3>Online Users ({onlineUsers.length})</h3>
      <ul>
        {onlineUsers.map((userId) => (
          <li
            key={userId}
            className={userId === currentUserId ? "current-user" : ""}
            onClick={() => onUserSelect(userId)}
          >
            User {userId}
            {userId === currentUserId && " (You)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsersList;
