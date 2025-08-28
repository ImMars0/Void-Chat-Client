import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/authentication/login";
import SignUp from "./components/authentication/signUp";
import Layout from "./components/layout";
import UserSearch from "./components/friendship/userSearch";
import FriendRequests from "./components/friendship/friendRequests";
import FriendsList from "./components/friendship/friendsList";
import PrivateChat from "./components/chats/privateChat";
import Chat from "./components/chats/groupChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="privateChat" element={<PrivateChat />} />
          <Route path="userSearch" element={<UserSearch />} />
          <Route path="friendRequests" element={<FriendRequests />} />
          <Route path="friendsList" element={<FriendsList />} />
          <Route path="chat" element={<Chat />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const isAuthenticated = !!localStorage.getItem("userId");
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default App;
