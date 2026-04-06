const express = require("express");
const { login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { chaosMiddleware } = require("../middleware/chaos");

const router = express.Router();

// Chaos applied to login too – real auth services have latency
router.post("/login", chaosMiddleware, login);
router.get("/me", chaosMiddleware, authenticate, me);

module.exports = router;
