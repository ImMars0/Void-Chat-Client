import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import SignUp from "./components/signUp";
import Login from "./components/login";
import Chatting from "./components/chatting";
import UserSearch from "./components/UserSearch";
import PrivateChat from "./components/privateChat";
import Layout from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/signup"];

  return (
    <div className="App">
      {!hideLayoutRoutes.includes(location.pathname) && <Layout />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatting" element={<Chatting />} />
          <Route path="/userSearch" element={<UserSearch />} />
          <Route path="/privateChat" element={<PrivateChat />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Void</h1>
      <p>Connect and chat with your friends</p>
    </div>
  );
}

export default App;
