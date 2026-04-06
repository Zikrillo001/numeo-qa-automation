/**
 * chaos.js – Simulates real-world production behaviour.
 *
 * Knobs (set via env vars to make CI overridable):
 *   FLAKINESS_RATE  – 0.0 … 1.0, default 0.15  (15 % of requests fail)
 *   MIN_DELAY_MS    – default 100
 *   MAX_DELAY_MS    – default 1500
 *   CHAOS_ENABLED   – set to "false" to disable entirely (useful in CI)
 */

const FLAKINESS_RATE = parseFloat(process.env.FLAKINESS_RATE ?? "0.15");
const MIN_DELAY      = parseInt(process.env.MIN_DELAY_MS    ?? "100",  10);
const MAX_DELAY      = parseInt(process.env.MAX_DELAY_MS    ?? "1500", 10);
const CHAOS_ENABLED  = process.env.CHAOS_ENABLED !== "false";

const FLAKY_ERRORS = [
  "Upstream service temporarily unavailable",
  "Database connection pool exhausted",
  "Request timed out after reaching downstream service",
  "Transient network error – please retry",
];

function randomDelay() {
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
}

function randomFlakeMessage() {
  return FLAKY_ERRORS[Math.floor(Math.random() * FLAKY_ERRORS.length)];
}

/**
 * Express middleware.
 * - Always adds an artificial async delay.
 * - Occasionally (FLAKINESS_RATE) responds with HTTP 500 before the handler runs.
 */
function chaosMiddleware(req, res, next) {
  if (!CHAOS_ENABLED) return next();

  const delay = randomDelay();

  setTimeout(() => {
    // Inject X-Response-Time so tests can assert on it
    res.setHeader("X-Response-Time-Ms", delay);
    res.setHeader("X-Chaos-Enabled", "true");

    if (Math.random() < FLAKINESS_RATE) {
      const msg = randomFlakeMessage();
      console.warn(`[CHAOS] 💥  Injecting 500 after ${delay}ms – "${msg}"`);
      return res.status(500).json({
        success: false,
        data: null,
        error: msg,
        _chaos: true,   // lets test code distinguish intentional flakes
      });
    }

    next();
  }, delay);
}

module.exports = { chaosMiddleware, randomDelay };
