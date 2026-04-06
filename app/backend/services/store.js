/**
 * store.js – Simple in-memory data store.
 *
 * Seeded with realistic-looking items so testers have data to work with
 * immediately without needing to POST anything first.
 */

const { v4: uuidv4 } = require("uuid");

// ── Users ─────────────────────────────────────────────────────────────────────
// Password is stored in plain text intentionally – this is a demo / testing env.
const USERS = [
  { id: "user-001", username: "admin",    password: "admin123",  role: "admin" },
  { id: "user-002", username: "tester",   password: "test1234",  role: "tester" },
  { id: "user-003", username: "readonly", password: "readonly1", role: "viewer" },
];

// ── Items (Tasks) ──────────────────────────────────────────────────────────────
let items = [
  {
    id: uuidv4(),
    title: "Set up CI pipeline",
    description: "Configure GitHub Actions to run the test suite on every PR.",
    status: "completed",
    createdAt: new Date("2024-12-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2024-12-03T14:22:00Z").toISOString(),
  },
  {
    id: uuidv4(),
    title: "Write smoke tests",
    description: "Create a smoke test suite covering the happy-path for all endpoints.",
    status: "active",
    createdAt: new Date("2024-12-10T11:30:00Z").toISOString(),
    updatedAt: new Date("2024-12-10T11:30:00Z").toISOString(),
  },
  {
    id: uuidv4(),
    title: "Investigate flaky login test",
    description: "The login test fails intermittently in CI – likely a race condition.",
    status: "active",
    createdAt: new Date("2025-01-05T08:45:00Z").toISOString(),
    updatedAt: new Date("2025-01-06T10:00:00Z").toISOString(),
  },
  {
    id: uuidv4(),
    title: "Add data-testid attributes",
    description: "Ensure all interactive UI elements have stable data-testid selectors.",
    status: "completed",
    createdAt: new Date("2025-01-15T13:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-16T09:15:00Z").toISOString(),
  },
  {
    id: uuidv4(),
    title: "Load test the items endpoint",
    description: "Use k6 to run a 60-second load test at 50 VU and assert p95 < 2 s.",
    status: "active",
    createdAt: new Date("2025-02-01T07:00:00Z").toISOString(),
    updatedAt: new Date("2025-02-01T07:00:00Z").toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const store = {
  // Users
  findUserByUsername: (username) =>
    USERS.find((u) => u.username === username) || null,

  // Items – all methods return copies so callers can't mutate internal state accidentally
  getAllItems: () => items.map((i) => ({ ...i })),

  getItemById: (id) => {
    const item = items.find((i) => i.id === id);
    return item ? { ...item } : null;
  },

  createItem: ({ title, description, status = "active" }) => {
    const now = new Date().toISOString();
    const newItem = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    return { ...newItem };
  },

  updateItem: (id, fields) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...fields, id, updatedAt: new Date().toISOString() };
    return { ...items[idx] };
  },

  deleteItem: (id) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    return true;
  },

  // Utility for tests: reset to a known seeded state
  reset: () => {
    items = items.slice(0, 5); // trim any test-created items back to seed data
  },
};

module.exports = store;
