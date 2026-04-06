const jwt = require("jsonwebtoken");
const store = require("../services/store");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_TTL = "2h";

/**
 * POST /auth/login
 * Body: { username, password }
 */
function login(req, res) {
  const { username, password } = req.body || {};

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "Both 'username' and 'password' fields are required",
    });
  }

  if (typeof username !== "string" || username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "'username' must be a non-empty string",
    });
  }

  // ── Auth check ──────────────────────────────────────────────────────────────
  const user = store.findUserByUsername(username.trim());

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      data: null,
      error: "Invalid username or password",
    });
  }

  // ── Issue token ─────────────────────────────────────────────────────────────
  const payload = { sub: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });

  return res.status(200).json({
    success: true,
    data: {
      token,
      expiresIn: TOKEN_TTL,
      user: { id: user.id, username: user.username, role: user.role },
    },
    error: null,
  });
}

/**
 * GET /auth/me  (protected – needs valid token)
 */
function me(req, res) {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
    error: null,
  });
}

module.exports = { login, me };
