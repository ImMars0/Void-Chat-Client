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
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Void</h1>
          <NavButtons />
        </header>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
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
        <button disabled={location.pathname === "/signup"}>Sign Up</button>
      </Link>
      <Link to="/login">
        <button disabled={location.pathname === "/login"}>Login</button>
      </Link>
    </nav>
  );
}

export default App;
