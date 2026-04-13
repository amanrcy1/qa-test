# QA Test Automation Demo

E-commerce test automation project using Cypress (E2E) and Node.js (API tests), with Jenkins CI/CD pipeline running inside Docker.

## Tech Stack

- **Cypress** — E2E browser tests against [saucedemo.com](https://www.saucedemo.com)
- **Node.js** — API tests against [JSONPlaceholder](https://jsonplaceholder.typicode.com)
- **Jenkins** — CI/CD pipeline (Jenkinsfile)
- **Docker** — Test execution environment (Dockerfile)

## Project Structure

```
├── Jenkinsfile                  # CI/CD pipeline definition
├── Dockerfile                   # Test runner image (Java + Node + Chrome)
├── package.json
├── cypress.config.js
├── config/                      # Environment configs (staging/production)
├── cypress/
│   ├── e2e/                     # Test specs (login, cart)
│   ├── pages/                   # Page Object Model (Login, Inventory, Cart, Checkout)
│   ├── fixtures/                # Test data (users, checkout info)
│   └── support/                 # Custom commands + global setup
└── tests/
    └── api/                     # API test suite + helpers
```

## Run Locally

```bash
# install dependencies
npm install

# run API tests (no browser needed)
npm run test:api

# run Cypress E2E tests
npm run test:e2e

# open Cypress UI (interactive mode)
npx cypress open
```

## Run in Docker

```bash
# build the test runner image
docker build -t qa-test-runner:latest .

# run API tests inside container
docker run --rm -v $(pwd):/app -w /app qa-test-runner:latest npm run test:api

# run Cypress inside container
docker run --rm -v $(pwd):/app -w /app qa-test-runner:latest npm run test:e2e
```

## Test Coverage

| Type | Tests | Target |
|------|-------|--------|
| E2E - Login | 5 | Valid login, invalid, locked user, empty fields |
| E2E - Cart | 5 | Add, remove, multiple items, checkout flow |
| API | 8 | GET, POST, PUT, DELETE, filtering, 404 |
