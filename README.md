# ✅ FINAL (CLEAN + PROFESSIONAL) README

```md
# 🧪 Numeo QA Automation Framework

A production-style QA automation framework for validating a full-stack application (Node.js backend + React frontend) using API and End-to-End testing.

This project demonstrates real-world QA engineering practices:
- API testing
- UI (E2E) automation
- CI/CD integration
- Flaky system handling
- Clean and scalable architecture

---

## 🚀 Tech Stack

- Playwright (E2E + API)
- TypeScript
- Node.js (backend under test)
- React (frontend under test)
- GitHub Actions (CI)

---

## 📁 Project Structure

```

numeo-qa-automation/
│
├── app/
│   ├── backend/        # Demo API (Express)
│   └── frontend/       # React application
│
├── src/
│   ├── api-clients/    # API abstraction layer
│   ├── ui-pages/       # Page Object Model (POM)
│   └── utils/          # Helpers (logger, config)
│
├── tests/
│   ├── api/            # API tests
│   ├── e2e/            # End-to-End tests
│   └── fixtures/       # Test data
│
├── playwright.config.ts
└── .github/workflows/tests.yml

```

---

## 🧠 Test Strategy

### API Tests (`tests/api`)
- Authentication (valid / invalid)
- Authorization checks
- CRUD operations
- Negative scenarios (invalid payloads)

### E2E Tests (`tests/e2e`)
- Login flow (valid / invalid)
- Full item lifecycle (create → update → delete)
- UI validation (forms, errors)

---

## 🏗️ Architecture

### Page Object Model
UI interactions are encapsulated in page objects:

```

src/ui-pages/
login.page.ts
items.page.ts

```

### API Client Layer

```

src/api-clients/
auth.client.ts
items.client.ts

```

This separation improves:
- readability
- reusability
- maintainability

---

## 🔍 Observability

The framework provides:

- HTML test reports
- Screenshots on failure
- Video recording on failure
- Playwright traces (on retry)
- Structured step logging

---

## ⚙️ Environment Configuration

Example variables:

```

FRONTEND_URL=[http://localhost:3000](http://localhost:3000)
API_URL=[http://localhost:4000](http://localhost:4000)
USERNAME=admin
PASSWORD=admin123
CHAOS_ENABLED=false

````

---

## ▶️ Running Locally

### 1. Install dependencies

```bash
npm install
cd app/backend && npm install
cd ../frontend && npm install
````

### 2. Start backend

```bash
cd app/backend
npm start
```

### 3. Start frontend

```bash
cd app/frontend
npm start
```

### 4. Run tests

API tests:

```bash
npm run test:api
```

E2E tests:

```bash
npm run test:e2e
```

---

## 📊 Reports

```bash
npx playwright show-report
```

---

## 🔄 CI/CD

GitHub Actions pipeline:

* installs dependencies
* starts backend & frontend
* waits for services readiness
* runs API and E2E tests
* uploads reports and logs

Workflow:

```
.github/workflows/tests.yml
```

---

## ⚠️ Flaky System Simulation

The backend supports chaos mode:

* random delays
* random 500 errors

Enable via:

```bash
CHAOS_ENABLED=true
```

Purpose:

* test resilience
* simulate real-world instability

---

## 🧩 Key Decisions

* UI tests rely on **UI state**, not network interception
* API and UI layers are separated
* minimal hardcoding
* CI optimized for stability (no aggressive parallelism)

---

## 🚧 Limitations

* in-memory data storage (no persistence)
* limited UI negative scenarios
* CI parallel execution disabled for stability

---

## 📌 Future Improvements

* Allure reporting integration
* performance testing (k6 / JMeter)
* Docker setup
* extended test coverage

---

## 🎯 Summary

This project demonstrates:

* structured QA automation framework
* API + E2E coverage
* CI integration
* debugging and stability practices

Designed to reflect real-world QA engineering standards.

```

