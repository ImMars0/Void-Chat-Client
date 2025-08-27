import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <h1>Void Chat</h1>
      <nav className="main-nav">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/chatting"
          className={location.pathname === "/chatting" ? "active" : ""}
        >
          Chat
        </Link>
        <Link
          to="/userSearch"
          className={location.pathname === "/userSearch" ? "active" : ""}
        >
          Find Friends
        </Link>
      </nav>
    </header>
  );
};

export default Layout;
