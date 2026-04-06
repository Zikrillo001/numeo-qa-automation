const store = require("../services/store");

const VALID_STATUSES = ["active", "completed"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function validateItemBody(body, requireAll = true) {
  const errors = [];
  const { title, description, status } = body || {};

  if (requireAll || title !== undefined) {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      errors.push("'title' is required and must be a non-empty string");
    } else if (title.trim().length > 120) {
      errors.push("'title' must be 120 characters or fewer");
    }
  }

  if (requireAll || description !== undefined) {
    if (description === undefined || description === null) {
      errors.push("'description' is required");
    } else if (typeof description !== "string") {
      errors.push("'description' must be a string");
    } else if (description.length > 1000) {
      errors.push("'description' must be 1000 characters or fewer");
    }
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`'status' must be one of: ${VALID_STATUSES.join(", ")}`);
    }
  }

  return errors;
}

// ── Controllers ───────────────────────────────────────────────────────────────

/** GET /items */
function getAll(req, res) {
  const { status, search } = req.query;
  let result = store.getAllItems();

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: `Query param 'status' must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    result = result.filter((i) => i.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    data: { items: result, total: result.length },
    error: null,
  });
}

/** GET /items/:id */
function getOne(req, res) {
  const item = store.getItemById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      data: null,
      error: `Item with id '${req.params.id}' not found`,
    });
  }

  return res.status(200).json({ success: true, data: { item }, error: null });
}

/** POST /items */
function create(req, res) {
  const errors = validateItemBody(req.body, true);
  if (errors.length) {
    return res.status(400).json({ success: false, data: null, error: errors.join("; ") });
  }

  const { title, description, status = "active" } = req.body;
  const item = store.createItem({ title: title.trim(), description, status });

  return res.status(201).json({ success: true, data: { item }, error: null });
}

/** PUT /items/:id */
function update(req, res) {
  const existing = store.getItemById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      data: null,
      error: `Item with id '${req.params.id}' not found`,
    });
  }

  const errors = validateItemBody(req.body, false);
  if (errors.length) {
    return res.status(400).json({ success: false, data: null, error: errors.join("; ") });
  }

  const { title, description, status } = req.body;
  const updates = {};
  if (title !== undefined)       updates.title       = title.trim();
  if (description !== undefined) updates.description = description;
  if (status !== undefined)      updates.status      = status;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "No updatable fields provided",
    });
  }

  const item = store.updateItem(req.params.id, updates);
  return res.status(200).json({ success: true, data: { item }, error: null });
}

/** DELETE /items/:id */
function remove(req, res) {
  const deleted = store.deleteItem(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      data: null,
      error: `Item with id '${req.params.id}' not found`,
    });
  }

  return res.status(200).json({
    success: true,
    data: { message: "Item deleted successfully", id: req.params.id },
    error: null,
  });
}

module.exports = { getAll, getOne, create, update, remove };
