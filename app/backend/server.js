const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Request logger (handy when writing test assertions against logs)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// Health-check – useful in CI pipelines / readiness probes
app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() }, error: null });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, data: null, error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀  QA-Demo backend listening on http://localhost:${PORT}`);
  console.log(`   Flakiness rate : ~15%`);
  console.log(`   Delay range    : 100–1500 ms`);
});

module.exports = app;
