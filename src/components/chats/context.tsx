import React, { createContext, useState, useContext, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { apiClient } from "../../API/urlApi";

interface Message {
  id: number;
  senderId: number;
  receiverId?: number;
  chatId?: number;
  content: string;
  timestamp: string;
  senderName: string;
}

interface ChatContextType {
  currentUserId: number;
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
  messages: Message[];
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUserId] = useState<number>(
    parseInt(localStorage.getItem("userId") || "0")
  );
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiClient.defaults.baseURL}/chatHub?userId=${currentUserId}`)
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.error(err));

    hubConnection.on("ReceiveMessage", (msg: Message) => {
      if (!selectedChatId || (msg.chatId && msg.chatId === selectedChatId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    setConnection(hubConnection);

    return () => {
      hubConnection.stop();
    };
  }, [currentUserId, selectedChatId]);

  const sendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim() || !connection) return;
    await apiClient.post(`/chats/${selectedChatId}/messages`, { content });
  };

  return (
    <ChatContext.Provider
      value={{
        currentUserId,
        selectedChatId,
        setSelectedChatId,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
