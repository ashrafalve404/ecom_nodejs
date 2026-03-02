import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">◆</span>
          <h1>Admin</h1>
        </div>
        <p className="login-hint">demo: admin / admin123</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
