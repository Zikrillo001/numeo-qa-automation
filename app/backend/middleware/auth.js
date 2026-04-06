const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "qa-demo-super-secret-key";

/**
 * Verifies the Bearer token in the Authorization header.
 * Attaches `req.user` on success, returns 401/403 on failure.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      data: null,
      error: "Authorization header missing",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({
      success: false,
      data: null,
      error: "Authorization header must be: Bearer <token>",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    return res.status(403).json({
      success: false,
      data: null,
      error: isExpired ? "Token has expired" : "Invalid token",
    });
  }
}

module.exports = { authenticate, JWT_SECRET };
