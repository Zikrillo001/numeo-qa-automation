# 🧪 Numeo QA Automation Project

A production-style QA automation framework designed to validate a full-stack application (Node.js backend + React frontend) using API and End-to-End testing.

This project demonstrates real-world QA engineering practices including:
- API test automation
- UI (E2E) automation
- CI/CD integration
- Flaky system handling
- Clean architecture and maintainability

---

## 🚀 Tech Stack

**Testing:**
- Playwright (E2E + API)
- TypeScript

**Backend (System Under Test):**
- Node.js (Express)

**Frontend:**
- React (SPA)

**CI/CD:**
- GitHub Actions

---

## 📁 Project Structure

```bash
numeo-qa-automation/
│
├── app/
│ ├── backend/ # Demo API server
│ └── frontend/ # React UI
│
├── src/
│ ├── api-clients/ # API abstraction layer
│ ├── ui-pages/ # Page Object Model (POM)
│ └── utils/ # Helpers (logger, config)
│
├── tests/
│ ├── api/ # API test suite
│ ├── e2e/ # End-to-End tests
│ └── fixtures/ # Test data
│
├── playwright.config.ts
├── tsconfig.json
└── .github/workflows/tests.yml
```


---

## 🧠 Test Strategy

### 1. API Tests
Located in: `tests/api/`

Covers:
- Authentication (valid & invalid)
- Authorization (unauthorized access)
- CRUD operations on items
- Data validation and edge cases

---

### 2. E2E Tests
Located in: `tests/e2e/`

Covers:
- Login flow (valid / invalid)
- Full CRUD lifecycle (create → update → delete)
- UI validation (form validation, error handling)

---

### 3. Error Handling
- Invalid login scenarios
- Required field validation
- API failure scenarios

---

## 🏗️ Architecture

### Page Object Model (POM)
UI tests follow POM for maintainability:

```bash
src/ui-pages/
login.page.ts
items.page.ts
```

### API Client Layer

```bash
src/api-clients/
auth.client.ts
items.client.ts
```


Benefits:
- Reusability
- Clean separation of concerns
- Easier debugging

---

## 🔍 Observability

The framework includes rich debugging support:

- ✅ HTML reports
- 📸 Screenshots on failure
- 🎥 Video recording on failure
- 🔎 Playwright trace (on retry)
- 🧾 Structured step logging

---

## ⚙️ Environment Configuration

Environment variables:

```bash
FRONTEND_URL=http://localhost:3000

API_URL=http://localhost:4000

USERNAME=admin
PASSWORD=admin123
CHAOS_ENABLED=false
```


---

## ▶️ How to Run Locally

### 1. Install dependencies

```bash
npm install
cd app/backend && npm install
cd ../frontend && npm install
```

### 4. Run tests
API tests

```bash
npm run test:api
```
E2E tests

```bash
npm run test:e2e
```

---

### 📊 Reports

After running tests:

```bash
npx playwright show-report
```

### 🔄 CI/CD (GitHub Actions)

Pipeline includes:

Dependency installation
Backend & frontend startup
Health checks
API tests execution
E2E tests execution
Artifacts upload (reports, logs)

Workflow file:

```bash
.github/workflows/tests.yml
```

---

### ⚠️ Flaky System Simulation

The backend includes optional chaos mode:

Random delays
Random 500 errors

Controlled via:

```bash
CHAOS_ENABLED=true
```
Purpose:

Validate test stability
Simulate real-world conditions


🧩 Key Design Decisions
UI tests rely on UI state, not network interception → more stable
API and UI layers are separated
Test data is centralized
Minimal hardcoding
CI designed for reproducibility
🚧 Known Limitations
No database persistence (in-memory store)
Limited negative UI scenarios
No parallel execution tuning in CI (for stability)
📌 Future Improvements
Add contract testing
Integrate Allure reporting
Add performance tests (k6 / JMeter)
Expand test coverage (edge cases)
Dockerize services
👨‍💻 Author

QA Automation Engineer