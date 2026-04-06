# QA Demo App — Full-Stack Automation Practice System

A realistic, intentionally flaky Node/React application built specifically for
QA automation practice. Every design decision prioritises **testability**,
**realistic production behaviour**, and **predictable response schemas**.

---

## 📁 Project Structure

```
qa-demo/
├── backend/
│   ├── server.js                  # Express entry point
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js                # POST /auth/login, GET /auth/me
│   │   └── items.js               # CRUD /items
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemsController.js
│   ├── services/
│   │   └── store.js               # In-memory data store (seeded)
│   └── middleware/
│       ├── auth.js                # JWT verification
│       └── chaos.js               # Delays + random 500s
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js                 # Auth context + routing
        ├── App.css
        ├── pages/
        │   ├── LoginPage.js
        │   └── ItemsPage.js
        ├── components/
        │   ├── ItemModal.js       # Create / Edit modal
        │   └── ConfirmDialog.js   # Delete confirmation
        └── services/
            └── api.js             # All HTTP calls
```

---

## 🚀 Running the App

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1 — Backend

```bash
cd qa-demo/backend
npm install
npm start
# Server starts on http://localhost:4000
```

Dev mode with auto-reload:
```bash
npm run dev   # requires nodemon (installed as devDependency)
```

### 2 — Frontend

```bash
cd qa-demo/frontend
npm install
npm start
# React app starts on http://localhost:3000
```

The frontend proxies API requests to `http://localhost:4000` automatically.

---

## 🔐 Demo Credentials

| Username   | Password   | Role    |
|------------|------------|---------|
| `admin`    | `admin123` | admin   |
| `tester`   | `test1234` | tester  |
| `readonly` | `readonly1`| viewer  |

---

## 🌐 API Reference

### Envelope Schema (all responses)

```json
{
  "success": true,
  "data":    { },
  "error":   null
}
```

### Status Codes

| Code | Meaning               |
|------|-----------------------|
| 200  | OK                    |
| 201  | Created               |
| 400  | Validation error      |
| 401  | Missing / bad token   |
| 403  | Expired / invalid JWT |
| 404  | Resource not found    |
| 500  | Random server failure |

---

## 📡 Example curl Requests

### Health check (no auth)

```bash
curl http://localhost:4000/health
```

### Login

```bash
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .
```

Save the token:
```bash
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.data.token')
```

### Get all items

```bash
curl -s http://localhost:4000/items \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Filter by status

```bash
curl -s "http://localhost:4000/items?status=active" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Search

```bash
curl -s "http://localhost:4000/items?search=CI" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Get single item

```bash
curl -s http://localhost:4000/items/<ITEM_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Create item

```bash
curl -s -X POST http://localhost:4000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My new task",
    "description": "Created via curl",
    "status": "active"
  }' | jq .
```

### Update item

```bash
curl -s -X PUT http://localhost:4000/items/<ITEM_ID> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | jq .
```

### Delete item

```bash
curl -s -X DELETE http://localhost:4000/items/<ITEM_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Error scenarios (for testing)

```bash
# 401 – no token
curl -s http://localhost:4000/items | jq .

# 403 – invalid token
curl -s http://localhost:4000/items \
  -H "Authorization: Bearer invalidtoken123" | jq .

# 400 – missing required fields
curl -s -X POST http://localhost:4000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

# 400 – invalid status value
curl -s -X POST http://localhost:4000/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"x","description":"y","status":"INVALID"}' | jq .

# 404 – non-existent item
curl -s http://localhost:4000/items/does-not-exist \
  -H "Authorization: Bearer $TOKEN" | jq .

# 401 – wrong password
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}' | jq .
```

---

## ⚠️ Chaos / Flakiness Behaviour

The backend simulates production instability:

| Behaviour        | Default          | Env Var Override         |
|------------------|------------------|--------------------------|
| Failure rate     | 15% → HTTP 500   | `FLAKINESS_RATE=0.05`    |
| Min delay        | 100 ms           | `MIN_DELAY_MS=50`        |
| Max delay        | 1500 ms          | `MAX_DELAY_MS=500`       |
| Disable entirely | (enabled)        | `CHAOS_ENABLED=false`    |

**Disabling chaos for stable CI runs:**

```bash
CHAOS_ENABLED=false npm start
```

**Flaky responses include `"_chaos": true`** in the JSON body so test code can
distinguish intentional failures from real bugs.

**Response headers set by chaos middleware:**
- `X-Response-Time-Ms` — actual injected delay in ms
- `X-Chaos-Enabled` — "true"

---

## 🧪 data-testid Selector Reference

All interactive UI elements carry stable `data-testid` attributes.

### Login page
| Selector                        | Element                    |
|---------------------------------|----------------------------|
| `[data-testid="login-page"]`    | Page root                  |
| `[data-testid="login-form"]`    | `<form>`                   |
| `[data-testid="input-username"]`| Username input             |
| `[data-testid="input-password"]`| Password input             |
| `[data-testid="btn-login"]`     | Submit button              |
| `[data-testid="login-error"]`   | Error alert                |
| `[data-testid="demo-credentials"]` | Quick-fill buttons      |
| `[data-testid="credential-admin"]` | Fill admin credentials  |

### Items page
| Selector                               | Element                   |
|----------------------------------------|---------------------------|
| `[data-testid="items-page"]`           | Page root                 |
| `[data-testid="logged-in-user"]`       | Username display          |
| `[data-testid="btn-logout"]`           | Sign out button           |
| `[data-testid="items-count"]`          | Item count badge          |
| `[data-testid="filter-search"]`        | Search input              |
| `[data-testid="filter-status"]`        | Status dropdown           |
| `[data-testid="btn-create-item"]`      | New item button           |
| `[data-testid="btn-refresh"]`          | Refresh button            |
| `[data-testid="items-list"]`           | List container            |
| `[data-testid="items-loading"]`        | Loading state             |
| `[data-testid="items-empty"]`          | Empty state               |
| `[data-testid="page-error"]`           | Error alert               |
| `[data-testid="page-success"]`         | Success toast             |
| `[data-testid="btn-retry"]`            | Retry button              |
| `[data-testid="item-card-{id}"]`       | Individual item card      |
| `[data-testid="item-title-{id}"]`      | Item title                |
| `[data-testid="item-desc-{id}"]`       | Item description          |
| `[data-testid="item-status-{id}"]`     | Status badge              |
| `[data-testid="btn-edit-{id}"]`        | Edit button               |
| `[data-testid="btn-delete-{id}"]`      | Delete button             |

### Item modal (create / edit)
| Selector                            | Element                |
|-------------------------------------|------------------------|
| `[data-testid="item-modal-overlay"]`| Modal backdrop         |
| `[data-testid="item-modal"]`        | Modal container        |
| `[data-testid="modal-title"]`       | Modal heading          |
| `[data-testid="item-form"]`         | `<form>`               |
| `[data-testid="input-item-title"]`  | Title input            |
| `[data-testid="input-item-description"]` | Description textarea |
| `[data-testid="select-item-status"]`| Status select          |
| `[data-testid="modal-error"]`       | Inline error           |
| `[data-testid="btn-modal-save"]`    | Save/Create button     |
| `[data-testid="btn-modal-cancel"]`  | Cancel button          |
| `[data-testid="btn-modal-close"]`   | ✕ close button         |

### Confirm dialog
| Selector                             | Element           |
|--------------------------------------|-------------------|
| `[data-testid="confirm-dialog-overlay"]` | Overlay       |
| `[data-testid="confirm-dialog"]`     | Dialog box        |
| `[data-testid="confirm-message"]`    | Message text      |
| `[data-testid="btn-confirm-ok"]`     | Confirm delete    |
| `[data-testid="btn-confirm-cancel"]` | Cancel            |

---

## 🧠 Tips for Automation Engineers

1. **Retry logic** — Always implement retries with back-off; ~15% of requests fail.
2. **Wait strategies** — Use explicit waits (Playwright `waitFor`, Cypress `intercept`) rather than fixed sleeps. Delays range from 100–1500 ms.
3. **Chaos flag** — Check `res._chaos === true` in API tests to categorise flaky failures separately from assertion failures.
4. **Seeded data** — The store starts with 5 items on every boot. Your tests can rely on these for read-only assertions.
5. **Response headers** — `X-Response-Time-Ms` lets you assert on performance budgets.
6. **Token expiry** — Tokens expire in 2 hours; useful for testing 403 handling.
7. **Deterministic IDs** — UUIDs are generated fresh on each server start; avoid hard-coding item IDs in tests. Fetch the list first, then operate on returned IDs.
