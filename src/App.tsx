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
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/login");

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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

function NavButtons() {
  const location = useLocation();

  const isSignUpPage = location.pathname.startsWith("/signup");
  const isLoginPage = location.pathname.startsWith("/login");

  return (
    <nav
      style={{
        marginTop: "20px",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      <Link to="/signup">
        <button disabled={isSignUpPage}>Sign up</button>
      </Link>
      <Link to="/register">
        <button disabled={isLoginPage}>Log in</button>
      </Link>
    </nav>
  );
}

export default App;
