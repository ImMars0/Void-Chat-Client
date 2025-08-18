import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../API/urlApi";
interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/authentication/login", {
        username: formData.usernameOrEmail,
        password: formData.password,
      });

      if (response.status !== 200) {
        throw new Error(response.data || "Login failed");
      }

      alert("Login successful!");

      console.log("Login response data:", response.data);
      const userId = response.data?.id;
      console.log("User ID:", userId);
      if (!userId) {
        setError("User ID not found in response");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("currentUserId", userId.toString());

      navigate("/chat");
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email:</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
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
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Home
        </button>
      </form>
    </div>
  );
};

export default Login;
