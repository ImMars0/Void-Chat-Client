import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import SignUp from "./components/signUp";
import Login from "./components/login";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div className="App">
      {!hideLayout && (
        <>
          <header className="App-header">
            <h1>Welcome to Void</h1>
            <NavButtons />
          </header>
        </>
      )}

      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

function NavButtons() {
  const location = useLocation();
  return (
    <nav style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
      <Link to="/">
        <button disabled={location.pathname === "/"}>Home</button>
      </Link>
      <Link to="/signup">
        <button disabled={location.pathname === "/signup"}>Sign up</button>
      </Link>
      <Link to="/login">
        <button disabled={location.pathname === "/login"}>Log in</button>
      </Link>
    </nav>
  );
}

export default App;
