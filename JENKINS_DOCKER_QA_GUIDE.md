## How Jenkins + Docker Integrate (The Big Picture)

```
Developer pushes code
        │
        ▼
   ┌─────────┐
   │  GitHub  │  ← Webhook triggers Jenkins
   └────┬────┘
        │
        ▼
   ┌─────────────────────────────────┐
   │          JENKINS SERVER          │
   │                                  │
   │  1. Receives trigger             │
   │  2. Spins up Docker container    │
   │  3. Runs tests INSIDE container  │
   │  4. Collects results & reports   │
   │  5. Destroys container           │
   └─────────────────────────────────┘
        │
        ▼
   Test Reports / Slack Notifications / JIRA Updates
```

## Why Docker in CI/CD Testing?

| Problem Without Docker | Solution With Docker |
|------------------------|----------------------|
| "Works on my machine" issues | Same image everywhere — local, CI, staging |
| Flaky tests due to env differences | Isolated, reproducible environment every run |
| Slow setup of Java + Node + Chrome | Pre-built image with everything installed |
| Conflicting dependency versions | Each pipeline run gets a fresh container |
| Hard to scale test execution | Spin up multiple containers in parallel |

## Key Concepts to Know for Interview

### Jenkins Basics
- **Pipeline**: Defined in a `Jenkinsfile` (Pipeline-as-Code)
- **Stages**: Logical groups (Checkout → Install → Test → Report)
- **Agent**: Where the pipeline runs — can be a Docker container
- **Post actions**: Run after stages (success/failure notifications, cleanup)
- **Triggers**: Webhook (GitHub push), cron schedule, or manual

### Docker Basics
- **Dockerfile**: Recipe to build an image (installs Java, Node, Chrome, etc.)
- **Image**: Built artifact from Dockerfile — immutable, versioned
- **Container**: Running instance of an image — isolated, disposable
- **Volume mounts**: Share files between host and container (`-v /tmp:/tmp`)

### How They Work Together
1. **Build the image once**: `docker build -t qa-test-runner:latest .`
2. **Jenkins uses the image**: `agent { docker { image 'qa-test-runner:latest' } }`
3. **Each pipeline run**: Jenkins spins up a fresh container from that image
4. **Tests run inside**: Consistent environment with all tools pre-installed
5. **Container destroyed after**: Clean slate every time, no leftover state

## Common Interview Questions & Answers

**Q: Why use Docker with Jenkins?**
> Docker ensures every test run happens in an identical environment. No more
> "it passed on my machine" — the container has the exact same OS, browser
> version, Java version, and dependencies every single time.

**Q: What goes in a Dockerfile for QA?**
> Everything needed to run tests: Java + Maven (for TestNG), Node.js (for
> Cypress), Chrome browser (for E2E tests), and system libraries that
> Cypress needs for headless browser testing.

**Q: How does a Jenkinsfile work?**
> It's a Pipeline-as-Code file checked into Git. It defines stages
> (checkout, install, test, report), the agent (where to run — like a
> Docker container), environment variables, and post-build actions
> (notifications, cleanup).

**Q: How do you handle test failures in the pipeline?**
> Jenkins `post` blocks handle this — on failure, we can send Slack
> notifications, update JIRA tickets, and archive screenshots/videos
> from Cypress for debugging. The `junit` step publishes test results
> directly in the Jenkins UI.

**Q: How do you run Cypress in Docker?**
> The Docker image includes Chrome and all Cypress system dependencies.
> Cypress runs in headless mode (`npx cypress run`) inside the container.
> Videos and screenshots are archived as Jenkins artifacts for review.

**Q: What is Pipeline-as-Code?**
> Instead of configuring Jenkins jobs through the UI, the entire pipeline
> is defined in a Jenkinsfile stored in the repo. This means it's version
> controlled, reviewable in PRs, and stays in sync with the codebase.

## Quick Commands to Remember

```bash
# Build the Docker image
docker build -t qa-test-runner:latest .

# Run tests locally in the same container Jenkins uses
docker run --rm -v $(pwd):/app qa-test-runner:latest npm test

# Run Cypress inside Docker
docker run --rm -v $(pwd):/app qa-test-runner:latest npx cypress run

# Check Jenkins pipeline syntax (Jenkins CLI)
java -jar jenkins-cli.jar -s http://localhost:8080 declarative-linter < Jenkinsfile
```

## Pipeline Flow Summary

```
Jenkinsfile defines:
│
├── agent: docker { image 'qa-test-runner' }  ← Runs in Docker
│
├── stage: Checkout        ← Pull code from Git
├── stage: Install         ← npm ci (install deps)
├── stage: Lint            ← Code quality check
├── stage: Unit Tests      ← TestNG via Maven
├── stage: API Tests       ← Backend validation
├── stage: E2E Tests       ← Cypress browser tests
├── stage: Report          ← Generate HTML report
│
└── post:
    ├── success → Notify team ✅
    ├── failure → Alert + archive screenshots ❌
    └── always  → Clean workspace 🧹
```
