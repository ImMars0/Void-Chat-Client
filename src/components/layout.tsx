import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  const storedUsername = localStorage.getItem("username");

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1e1e2f",
      }}
    >
      <aside
        style={{
          width: 220,
          backgroundColor: "#2c2c3e",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#e5e5e5",
        }}
      >
        <div>
          <p>
            Logged in as: <strong>{storedUsername}</strong>
          </p>
          <h1 style={{ color: "#f5f5f5" }}>Void Chat</h1>

          <div style={{ marginTop: 30 }}>
            <h3 style={{ color: "#cfcfcf" }}>Friends</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link
                  to="/friendsList"
                  style={{
                    display: "block",
                    padding: 8,
                    backgroundColor: isActive("/friendsList")
                      ? "#4f46e5"
                      : "transparent",
                    borderRadius: 4,
                    color: "#f5f5f5",
                  }}
                >
                  My Friends
                </Link>
              </li>
              <li>
                <Link
                  to="/friendRequests"
                  style={{
                    display: "block",
                    padding: 8,
                    backgroundColor: isActive("/friendRequests")
                      ? "#6d28d9"
                      : "transparent",
                    borderRadius: 4,
                    color: "#f5f5f5",
                  }}
                >
                  Friend Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/userSearch"
                  style={{
                    display: "block",
                    padding: 8,
                    backgroundColor: isActive("/userSearch")
                      ? "#374151"
                      : "transparent",
                    borderRadius: 4,
                    color: "#f5f5f5",
                  }}
                >
                  Find Friends
                </Link>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3 style={{ color: "#cfcfcf" }}>Chat</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link
                  to="/privateChat"
                  style={{
                    display: "block",
                    padding: 8,
                    backgroundColor: isActive("/privateChat")
                      ? "#db2777"
                      : "transparent",
                    borderRadius: 4,
                    color: "#f5f5f5",
                  }}
                >
                  Friend Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  style={{
                    display: "block",
                    padding: 8,
                    backgroundColor: isActive("/chat")
                      ? "#facc15"
                      : "transparent",
                    borderRadius: 4,
                    color: "#1f1f1f",
                  }}
                >
                  Group Chat
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#b91c1c",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "#1e1e2f",
          color: "#f5f5f5",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
