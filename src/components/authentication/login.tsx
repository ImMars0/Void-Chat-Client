import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      localStorage.setItem("userId", response.id.toString());
      localStorage.setItem("username", response.username);
      navigate("/chatting");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        className="auth-container"
        style={{
          width: 320,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: "100%", padding: 10, marginTop: 10 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="secondary-button"
            disabled={isLoading}
            style={{ width: "100%", padding: 10, marginTop: 5 }}
          >
            Home
          </button>
        </form>

        <p className="auth-link" style={{ textAlign: "center", marginTop: 10 }}>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
