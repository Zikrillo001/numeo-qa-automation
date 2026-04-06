import React, { useState } from "react";
import { useAuth } from "../App";
import { authApi } from "../services/api";

const DEMO_CREDENTIALS = [
  { username: "admin",    password: "admin123"  },
  { username: "tester",   password: "test1234"  },
  { username: "readonly", password: "readonly1" },
];

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [retries,  setRetries]  = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login(username.trim(), password);

      if (res.success) {
        login(res.data.user, res.data.token);
      } else {
        // Distinguish between validation, auth, and server errors
        if (res._status === 500) {
          setRetries((r) => r + 1);
          setError(`Server error – this may be transient. Try again. (attempt ${retries + 1})`);
        } else {
          setError(res.error || "Login failed");
        }
      }
    } catch (err) {
      setError("Network error – is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function fillCredentials(cred) {
    setUsername(cred.username);
    setPassword(cred.password);
  }

  return (
    <div data-testid="login-page" className="login-wrapper">
      <div className="login-box card">
        <h2>QA Demo App</h2>
        <p className="subtitle">
          A realistic, intentionally flaky system for automation practice
          <span className="tag-chaos">⚠ chaos enabled</span>
        </p>

        {error && (
          <div data-testid="login-error" className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form data-testid="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              data-testid="input-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="e.g. admin"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <button
            data-testid="btn-login"
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "10px" }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" />Signing in…</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <hr />

        <p style={{ fontSize: "0.78rem", color: "#666", marginBottom: 8 }}>
          Quick-fill demo credentials:
        </p>
        <div data-testid="demo-credentials" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.username}
              data-testid={`credential-${cred.username}`}
              className="btn-secondary btn-sm"
              type="button"
              onClick={() => fillCredentials(cred)}
              disabled={loading}
            >
              {cred.username} / {cred.password}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
