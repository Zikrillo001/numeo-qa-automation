import React, { useState, useEffect, createContext, useContext } from "react";
import LoginPage from "./pages/LoginPage";
import ItemsPage from "./pages/ItemsPage";
import { tokenStorage, authApi } from "./services/api";
import "./App.css";

// ── Auth context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser]       = useState(null);
  const [checking, setChecking] = useState(true);  // verifying stored token on mount

  // Restore session from localStorage on first load
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) { setChecking(false); return; }

    authApi.me()
      .then((res) => {
        if (res.success) setUser(res.data.user);
        else tokenStorage.remove();          // token invalid / expired
      })
      .catch(() => tokenStorage.remove())
      .finally(() => setChecking(false));
  }, []);

  const login = (userData, token) => {
    tokenStorage.set(token);
    setUser(userData);
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);
  };

  if (checking) {
    return (
      <div data-testid="app-loading" className="centered-fullpage">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div data-testid="app-root">
        {user ? <ItemsPage /> : <LoginPage />}
      </div>
    </AuthContext.Provider>
  );
}
