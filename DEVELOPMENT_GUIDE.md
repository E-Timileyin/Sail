
---

# 🧱 SAIL — DEVELOPMENT GUIDE

This document defines the **internal development structure**, **engineering standards**, and **module responsibilities** for the **Sail CLI** project.

---

## 📂 Project Overview

**Sail** is a Go-based CLI tool that automates Docker container deployments to remote servers via SSH.  
It’s designed for backend engineers and DevOps teams to streamline deployments using simple commands.

---

## ⚙️ DEVELOPMENT WORKFLOW

### Branching Model (Solo Developer Optimized)

| Branch | Purpose | Notes |
|--------|----------|-------|
| `main` | Stable, production-ready code | Only merge tested features |
| `dev` | Active development | Default branch for work |
| `feature/*` | Isolated feature work | e.g., `feature/docker-engine` |
| `hotfix/*` | Urgent fixes | e.g., `hotfix/config-load-error` |

> 🧩 For a solo developer, use:
> - **`dev`** for all ongoing work
> - **`main`** for stable tagged releases only

---

## 🧠 DEVELOPMENT PHASES

### **Phase 1 — Core System Setup**
Goal: Create project skeleton and ensure local deployment workflow.

| Task | Description | Status |
|------|--------------|--------|
| ✅ Initialize project using Cobra CLI | Scaffold base structure | Done |
| ✅ Set up Go modules and dependencies | Cobra, Viper, SSH, Logrus | Done |
| ✅ Implement config loader | `.env` and YAML support | Done |
| ✅ Build SSH client wrapper | Command execution + output | Done |
| ⬜ Build logger utility | Color output + structured logs | Pending |
| ⬜ Implement deploy command | SSH + Docker pull/run | Pending |

---

### **Phase 2 — Docker + Workflow Engine**
Goal: Add Docker orchestration and remote workflow handling.

| Task | Description | Status |
|------|--------------|--------|
| ⬜ Build Docker manager | Handles deploy, stop, restart | Pending |
| ⬜ Implement rollback | Uses stored image tag history | Pending |
| ⬜ Implement `status` and `logs` | Remote container state fetch | Pending |
| ⬜ Add parallel deploys | Use `errgroup` for multiple servers | Pending |
| ⬜ Improve CLI UX | Add colorized messages and structured errors | Pending |

---

### **Phase 3 — CI/CD & Testing**
Goal: Automate build and add full test coverage.

| Task | Description | Status |
|------|--------------|--------|
| ⬜ Unit tests for config, ssh, docker | Use mocks and table tests | Pending |
| ⬜ Integration test suite | Test real SSH + Docker flows | Pending |
| ⬜ Setup GitHub Actions | Run build/test on PRs | Pending |
| ⬜ Add GoReleaser | Build cross-platform binaries | Pending |

---

### **Phase 4 — Advanced Features**
Goal: Add hooks, health checks, and analytics.

| Task | Description | Status |
|------|--------------|--------|
| ⬜ Pre/post deploy hooks | Custom scripts execution | Planned |
| ⬜ Deployment metrics | Track success/failure counts | Planned |
| ⬜ Config encryption | AES-encrypted credentials | Planned |
| ⬜ Agent mode | Continuous deployment watcher | Planned |

---

## 🧩 MODULE STRUCTURE

```

Sail/
├── cmd/
│   ├── deploy.go         # Main deploy command
│   ├── rollback.go       # Rollback command
│   ├── status.go         # Container status
│   ├── logs.go           # View recent container logs
│   └── root.go           # CLI entrypoint + version info
│
├── internal/
│   ├── ssh/
│   │   ├── client.go     # Handles SSH connection
│   │   └── executor.go   # Runs commands remotely
│   │
│   ├── docker/
│   │   ├── manager.go    # Docker orchestration logic
│   │   └── rollback.go   # Rollback utilities
│   │
│   ├── config/
│   │   ├── loader.go     # YAML and .env loader
│   │   ├── schema.go     # Validation structs
│   │   └── validator.go  # Data validation rules
│   │
│   ├── logger/
│   │   └── logger.go     # logrus + colorized logging
│   │
│   └── workflows/
│       └── orchestrator.go # Main deploy sequence logic
│
├── configs/
│   ├── servers.yaml
│   └── .env
│
├── tests/
│   ├── ssh_test.go
│   ├── docker_test.go
│   ├── config_test.go
│   └── workflows_test.go
│
├── main.go
└── go.mod

````

---

## 🧰 TOOLING

| Tool | Purpose |
|------|----------|
| **Cobra CLI** | Command scaffolding |
| **Viper** | Config + environment loading |
| **Logrus** | Structured logging |
| **Fatih/Color** | CLI colorization |
| **Validator/v10** | Input validation |
| **GoReleaser** | Build automation |
| **GitHub Actions** | CI/CD automation |

---

## 🧪 TESTING STRATEGY

### Unit Tests
Use Go’s built-in `testing` package.
```bash
go test ./internal/config -v
````

### Integration Tests

Use mocked SSH servers (e.g., `testcontainers-go`) to simulate real-world conditions.

### Example Structure

```
tests/
├── ssh_test.go
├── docker_test.go
└── config_test.go
```

---

## 🚀 BUILD & RELEASE PROCESS

### Local Build

```bash
go build -o bin/sail main.go
```

### Cross-Platform

```bash
GOOS=linux GOARCH=amd64 go build -o bin/sail-linux
GOOS=windows GOARCH=amd64 go build -o bin/sail.exe
```

### GitHub Actions Workflow

`.github/workflows/build.yml` should:

* Run tests
* Build binaries
* Upload to release assets on tag push

---

## 🧠 CODING STANDARDS

* Use **Go modules** (`go.mod`)
* Maintain **clear separation** between packages
* **Avoid hardcoding paths** or secrets — use env variables
* Use **interfaces** for testable components (e.g., SSH client)
* Follow **Go naming conventions**: `CamelCase` for exported, `camelCase` for internal

### Example:

```go
type SSHExecutor interface {
  ExecuteCommand(host, user, key, command string) (string, error)
}
```

---

## 🗂️ COMMIT CONVENTIONS

Follow **Conventional Commits**:

| Type        | Description             |
| ----------- | ----------------------- |
| `feat:`     | New feature             |
| `fix:`      | Bug fix                 |
| `chore:`    | Build or tooling update |
| `refactor:` | Code improvement        |
| `test:`     | Test-related changes    |
| `docs:`     | Documentation updates   |

**Examples:**

```
feat(ssh): add timeout and retry for remote exec
fix(config): resolved nil pointer on missing key
chore(ci): added GoReleaser action
```

---

## 🧭 ROADMAP SUMMARY

| Version | Milestone     | Key Deliverables           |
| ------- | ------------- | -------------------------- |
| v0.1.0  | MVP           | Deploy + Rollback via SSH  |
| v0.2.0  | Docker Engine | Container orchestration    |
| v0.3.0  | Workflow      | Multi-server orchestration |
| v0.4.0  | CI/CD         | Auto build and release     |
| v1.0.0  | Production    | Full stability and docs    |

---

## 🧩 DEVELOPMENT COMMAND CHEATSHEET

| Command                | Description             |
| ---------------------- | ----------------------- |
| `go run main.go`       | Run CLI in dev mode     |
| `go build -o bin/sail` | Build binary            |
| `cobra add deploy`     | Create new command      |
| `go test ./...`        | Run all tests           |
| `./bin/sail --help`    | List available commands |

---

## 📋 CONTRIBUTION WORKFLOW

1. Pull latest changes:

   ```bash
   git pull origin dev
   ```
2. Create feature branch:

   ```bash
   git checkout -b feature/docker-manager
   ```
3. Commit using conventional format
4. Push to remote:

   ```bash
   git push origin feature/docker-manager
   ```
5. Merge back to `dev` after testing.

---

## 🧩 INTERNAL DESIGN PRINCIPLES

* **DRY** — Reuse SSH/Docker logic across commands
* **Testable** — Abstract interfaces for unit testing
* **Resilient** — Fail gracefully on network/SSH errors
* **Declarative** — Use config-driven deployments
* **Scalable** — Designed for future multi-server orchestration

---

## 👨‍💻 Maintainer

**Eyiowuawi Timileyin**
Backend Engineer | Go | DevOps Automation
Lagos, Nigeria
Email: [eyiowuawi.timileyin@gmail.com](mailto:eyiowuawi.timileyin@gmail.com)
GitHub: [@E-Timileyin](https://github.com/E-Timileyin)

---

**“Sail — Because shipping should be smooth.” ⚓**

---