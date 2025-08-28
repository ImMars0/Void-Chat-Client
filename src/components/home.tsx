import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Welcome to Void Chat
      </h1>
      <p style={{ marginBottom: "1.5rem" }}>
        Connect and chat with your friends
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
};

export default Home;
