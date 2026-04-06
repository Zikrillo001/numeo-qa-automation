/**
 * api.js – Centralised API service layer.
 *
 * All network calls live here so:
 *  - Tests can mock at a single boundary.
 *  - Base URL / headers are set in one place.
 *  - Consistent error handling across the app.
 */

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const tokenStorage = {
  get:    ()         => localStorage.getItem("qa_demo_token"),
  set:    (token)    => localStorage.setItem("qa_demo_token", token),
  remove: ()         => localStorage.removeItem("qa_demo_token"),
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = tokenStorage.get();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Parse JSON even on error responses – they follow the same envelope schema
  const json = await response.json().catch(() => ({
    success: false,
    data: null,
    error: `HTTP ${response.status} – non-JSON response`,
  }));

  // Attach http status to make caller error-handling easier
  json._status = response.status;
  json._ok     = response.ok;

  return json;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  me: () => request("/auth/me"),
};

// ── Items ─────────────────────────────────────────────────────────────────────
export const itemsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/items${params ? `?${params}` : ""}`);
  },

  getOne: (id) => request(`/items/${id}`),

  create: (payload) =>
    request("/items", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    request(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    request(`/items/${id}`, { method: "DELETE" }),
};

export default { authApi, itemsApi, tokenStorage };
