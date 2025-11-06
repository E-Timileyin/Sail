
---

# ⚓ Sail — Automated Docker Deployment CLI

A fast, secure, and flexible CLI tool for **deploying Dockerized applications to remote servers via SSH**.
Built with **Go**, **Cobra**, and **Viper**, `Sail` automates container updates, rollbacks, and monitoring.

---

## 🚀 Overview

`Sail` simplifies backend deployments by letting you:

* Deploy Docker images remotely via SSH
* Run multi-server deployments in parallel
* View logs and container statuses
* Rollback to previous stable versions automatically

All without needing a heavy CI/CD setup — ideal for developers and small teams that prefer speed and control.

---

## 🧱 Tech Stack

| Layer         | Technology                                                                                   | Purpose                         |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------------------- |
| CLI Framework | [Cobra](https://github.com/spf13/cobra)                                                      | Command routing & flag handling |
| Config Loader | [Viper](https://github.com/spf13/viper) + [godotenv](https://github.com/joho/godotenv)       | Environment & YAML config       |
| SSH Client    | [golang.org/x/crypto/ssh](https://pkg.go.dev/golang.org/x/crypto/ssh)                        | Secure SSH connections          |
| Logging       | [Logrus](https://github.com/sirupsen/logrus) + [fatih/color](https://github.com/fatih/color) | Structured, colorful output     |
| Validation    | [go-playground/validator](https://github.com/go-playground/validator)                        | Config and input validation     |
| Testing       | [testify](https://github.com/stretchr/testify)                                               | Unit testing and assertions     |

---

## 🗂️ Project Structure

```
Sail/
│
├── cmd/                  # CLI command definitions
│   ├── root.go           # Root command (sail)
│   ├── deploy.go         # Deploy Docker containers
│   ├── rollback.go       # Rollback to previous image
│   ├── status.go         # Check container status
│   └── logs.go           # Fetch recent container logs
│
├── internal/
│   ├── config/           # Config loading (YAML, env)
│   │   └── loader.go
│   ├── ssh/              # SSH connection handler
│   │   └── client.go
│   ├── docker/           # Docker orchestration layer
│   │   └── manager.go
│   ├── workflows/        # Deployment orchestration logic
│   │   └── orchestrator.go
│   └── logger/           # Logging utilities
│       └── logger.go
│
├── configs/
│   ├── servers.yaml      # List of target servers
│   └── .env              # Environment variables
│
├── tests/                # Unit and integration tests
│   └── ssh_test.go
│
├── go.mod
├── go.sum
└── main.go
```

---

## ⚙️ Setup & Installation

### 1️⃣ **Clone the Repo**

```bash
git clone https://github.com/E-Timileyin/Sail.git
cd Sail
```

### 2️⃣ **Install Dependencies**

```bash
go mod tidy
```

### 3️⃣ **Install Cobra CLI (if not yet installed)**

```bash
go install github.com/spf13/cobra-cli@latest
export PATH=$PATH:$(go env GOPATH)/bin
```

### 4️⃣ **Scaffold Commands (already in repo)**

To add new commands later:

```bash
cobra-cli add <command-name>
```

---

## Configuration

### **.env File**

```
SSH_USER=ubuntu
SSH_KEY_PATH=~/.ssh/id_rsa
DEPLOY_ENV=production
```

### **configs/servers.yaml**

```yaml
servers:
  - name: staging
    host: 192.168.1.20
    user: ubuntu
    key: ~/.ssh/id_rsa
    image: myapp:staging
  - name: production
    host: 18.210.120.52
    user: ubuntu
    key: ~/.ssh/id_rsa
    image: myapp:latest
```

---

## Usage

### Deploy a Docker Image

```bash
sail deploy --server production
```

### Check Container Status

```bash
sail status --server staging
```

### Fetch Recent Logs

```bash
sail logs --server production --tail 50
```

### Rollback to Previous Version

```bash
sail rollback --server staging
```

---

## Development Workflow

### 🔧 Branch Strategy (Single Developer Optimized)

| Branch      | Purpose                                  |
| ----------- | ---------------------------------------- |
| `main`      | Stable production-ready code             |
| `dev`       | Active development work                  |
| `feature/*` | (Optional) Specific new feature branches |

### Typical Workflow

```bash
# Switch to dev branch
git switch dev

# Make changes and commit
git add .
git commit -m "Add SSH connection layer"

# Push to remote
git push origin dev

# Merge when stable
git switch main
git merge dev
git push origin main
```

---

## 🧪 Testing

Run all tests:

```bash
go test ./... -v
```

Test only SSH package:

```bash
go test ./internal/ssh -v
```

---

## ⚡ Build Executable

For Linux:

```bash
GOOS=linux GOARCH=amd64 go build -o bin/sail
```

For Windows:

```bash
GOOS=windows GOARCH=amd64 go build -o bin/sail.exe
```

---

## 🧭 CI/CD Integration (Optional)

Set up a `.github/workflows/build.yml` to:

* Run `go test`
* Build binaries on release tags
* Auto-publish to GitHub Releases

---

## 🧠 Future Roadmap

| Feature          | Status        | Description                      |
| ---------------- | ------------- | -------------------------------- |
| SSH Key Agent    | Planned     | Cache SSH sessions               |
| Auto-Rollback    | Implemented | Rollback failed deploys          |
| Health Checks    | Planned     | Verify container startup success |
| Deployment Hooks | Planned     | Run pre/post deploy commands     |
| Web Dashboard    | Future     | GUI for monitoring deployments   |

---

## 🧑‍💻 Contribution Guide

Even as a solo dev, document your workflow for future scaling:

1. Work on `dev` branch for development
2. Use clear commit messages
3. Maintain unit tests for each new module
4. Run full test suite before merging into `main`

---

## 🧾 License

MIT License © 2025 Eyiowuawi Timileyin

---