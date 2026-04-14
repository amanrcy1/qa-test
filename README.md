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

## Test Coverage

| Type | Tests | What It Covers |
|------|-------|----------------|
| API | 19 | GET, POST, PUT, DELETE, filtering, 404 handling |
| E2E - Login | 5 | Valid login, invalid, locked user, empty fields |
| E2E - Cart | 2 | Add/remove items, verify cart, full checkout flow |
| **Total** | **26** | **All passing in Jenkins CI/CD** |

---

## Run Locally (No Docker)

```bash
# Install dependencies
npm install

# Run API tests
npm run test:api

# Run Cypress E2E tests (headed)
npx cypress open

# Run Cypress E2E tests (headless)
npm run test:e2e
```

---

## Run with Docker + Jenkins (Full CI/CD Pipeline)

### Step 1: Start Jenkins in Docker

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Step 2: Get Jenkins Admin Password

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://localhost:8080` in your browser and paste the password.

### Step 3: Install Required Plugins

After logging in, install these plugins:
- Pipeline
- Git
- GitHub Integration
- Docker Pipeline

Or via CLI:
```bash
# Download Jenkins CLI
docker exec jenkins bash -c "curl -sS -o /tmp/jenkins-cli.jar http://localhost:8080/jnlpJars/jenkins-cli.jar"

# Install plugins
docker exec jenkins java -jar /tmp/jenkins-cli.jar \
  -s http://localhost:8080 \
  -auth admin:<YOUR_PASSWORD> \
  install-plugin workflow-aggregator git github pipeline-stage-view docker-workflow -restart
```

### Step 4: Install Docker Inside Jenkins Container

```bash
docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io && usermod -aG docker jenkins"
docker restart jenkins
```

Fix Docker socket permissions:
```bash
docker exec -u root jenkins bash -c "chmod 666 /var/run/docker.sock"
```

### Step 5: Build the Test Runner Image

```bash
docker build -t qa-test-runner:latest .
```

### Step 6: Create the Pipeline Job

Go to Jenkins UI (`http://localhost:8080`):

1. Click **New Item**
2. Name: `qa-test-pipeline`
3. Select **Pipeline** → OK
4. Under **General**: Check "GitHub project", URL: `https://github.com/amanrcy1/qa-test/`
5. Under **Build Triggers**: Check "GitHub hook trigger for GITScm polling"
6. Under **Pipeline**:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/amanrcy1/qa-test.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
7. Click **Save**

### Step 7: Run the Pipeline

Click **Build Now** on the job page, or via CLI:

```bash
docker exec jenkins java -jar /tmp/jenkins-cli.jar \
  -s http://localhost:8080 \
  -auth admin:<YOUR_PASSWORD> \
  build qa-test-pipeline
```

---

## Pipeline Stages

```
Checkout → Install Dependencies → Lint → API Tests → E2E Tests (Cypress)
```

| Stage | What It Does | Time |
|-------|-------------|------|
| Checkout | Pulls code from GitHub | ~1s |
| Install Dependencies | `npm ci` | ~40s |
| Lint | Code quality check | ~1s |
| API Tests | 19 tests against JSONPlaceholder | ~3s |
| E2E Tests | 7 Cypress tests against saucedemo.com | ~10s |
| **Total** | | **~1 min** |

---

## Auto-Trigger on Push (Production)

For Jenkins to auto-trigger on `git push`, set up a GitHub webhook:

1. Go to GitHub repo → **Settings** → **Webhooks** → **Add webhook**
2. Payload URL: `http://<your-jenkins-url>/github-webhook/`
3. Content type: `application/json`
4. Trigger: **Just the push event**

> Note: Jenkins must be accessible from the internet (not localhost). Use a cloud server or ngrok for local testing.

---

## Key Files

| File | Purpose |
|------|---------|
| `Jenkinsfile` | Pipeline definition (stages, Docker agent, triggers) |
| `Dockerfile` | Test runner image (Ubuntu + Java + Node + dbus) |
| `cypress.config.js` | Cypress settings (retries, timeouts, base URL) |
| `cypress/e2e/login.cy.js` | Login page E2E tests |
| `cypress/e2e/cart.cy.js` | Shopping cart + checkout E2E tests |
| `tests/api/api-test.js` | API test suite |
| `cypress/pages/*.js` | Page Object Model classes |
| `cypress/fixtures/*.json` | Test data (users, checkout info) |
