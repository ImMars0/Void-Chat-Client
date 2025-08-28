import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const errorMessage =
        err.response?.data || "Registration failed. Please try again.";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Sign Up</h2>
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: 10, textAlign: "center" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              disabled={isLoading}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 10 }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 10 }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isLoading}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
            <small>Must include uppercase, lowercase, and number</small>
          </div>

          <div className="form-group" style={{ marginBottom: 10 }}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 10,
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              backgroundColor: "#e5e7eb",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
