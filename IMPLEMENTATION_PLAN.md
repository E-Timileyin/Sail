# SAIL CLI - PROFESSIONAL DEVELOPMENT IMPLEMENTATION PLAN

**Project:** Sail - Automated Docker Deployment CLI  
**Maintainer:** Eyiowuawi Timileyin     
**Document Version:** 1.0  
**Last Updated:** November 8, 2025  
**Current Phase:** Phase 1 (Core System Setup) - 85% Complete

---

## EXECUTIVE SUMMARY

Sail is a Go-based CLI tool designed to automate Docker container deployments to remote servers via SSH. The project is currently in Phase 1 with foundational infrastructure in place but requires completion of core deployment functionality, comprehensive testing, and production-ready features.

**Current Status:**
- ✅ Project scaffolding with Cobra CLI
- ✅ Configuration loader (YAML + .env support)
- ✅ SSH client wrapper with authentication
- ✅ Structured logging with Logrus
- ✅ Basic CI/CD with GitHub Actions
- ⚠️ Deploy command (partially implemented)
- ❌ Rollback functionality
- ❌ Status/logs commands
- ❌ Comprehensive test coverage
- ❌ Production-ready error handling

---

## PROBLEM STATEMENT

### Current Issues

1. **Incomplete Deployment Flow**
   - `cmd/deploy.go` implements basic SSH connection but lacks full Docker orchestration
   - No backup mechanism before deployment
   - Missing rollback capability on failure
   - No verification of deployment success

2. **Inconsistent Architecture**
   - SSH client logic exists in two places: `internal/config/ssh/client.go` and direct usage in `cmd/deploy.go`
   - Missing dedicated Docker manager module (planned in `internal/docker/`)
   - No workflow orchestration layer (planned in `internal/workflows/`)

3. **Limited Testing**
   - Only 2 test files: `config/loader_test.go` and `config/ssh/client_test.go`
   - No integration tests
   - No mocking for SSH/Docker operations
   - Test coverage estimated at < 30%

4. **Missing Commands**
   - `rollback` - not implemented
   - `status` - not implemented  
   - `logs` - not implemented

5. **Production Gaps**
   - Basic error handling (logger can be nil - fixed in root.go)
   - No retry logic for network operations
   - Insecure SSH host key verification (`ssh.InsecureIgnoreHostKey()`)
   - No deployment history tracking
   - Missing pre/post deployment hooks

---

## CURRENT STATE ANALYSIS

### Project Structure

```
Sail/
├── cmd/
│   ├── root.go          ✅ CLI entrypoint with global flags
│   ├── deploy.go        ⚠️ Partially complete (SSH + basic Docker commands)
│   ├── ssh.go           ✅ Interactive SSH helper command
│   └── serve.go         ⚠️ Placeholder server command
│
├── internal/
│   ├── config/
│   │   ├── loader.go         ✅ YAML config loading with Viper
│   │   ├── loader_test.go    ✅ Unit test
│   │   └── ssh/
│   │       ├── client.go      ✅ SSH command executor
│   │       └── client_test.go ✅ Unit test (skipped without SSH server)
│   │
│   ├── logger/
│   │   └── logger.go          ✅ Logrus wrapper with color support
│   │
│   ├── model/
│   │   ├── server.go          ✅ Server config struct with SSHConfig()
│   │   ├── deploy.go          ✅ Deployment struct
│   │   └── response.go        ✅ Response models
│   │
│   ├── docker/           ❌ NOT CREATED (planned)
│   └── workflows/        ❌ NOT CREATED (planned)
│
├── .github/workflows/
│   └── test.yml               ✅ Basic Go test on push to dev
│
├── config.yaml                ✅ Example configuration
├── go.mod                     ✅ Dependencies managed
└── main.go                    ✅ Entry point
```

### Key Code Snippets

**Current Deploy Implementation** (`cmd/deploy.go:82-120`):
```go
func executeDeployment(client *ssh.Client, _ *model.ServerStruct) error {
    // Check if Docker is installed
    if err := runCommand(client, "docker --version"); err != nil {
        return fmt.Errorf("docker is not installed on the server: %v", err)
    }

    // Check if Docker Compose is installed
    if err := runCommand(client, "docker-compose --version"); err != nil {
        return fmt.Errorf("docker-compose is not installed on the server: %v", err)
    }

    // Run the deployment commands
    commands := []struct {
        cmd         string
        ignoreError bool
    }{
        {cmd: "echo '==> Starting deployment...'", ignoreError: false},
        {cmd: "docker-compose pull", ignoreError: false},
        {cmd: "docker-compose down", ignoreError: true},
        {cmd: "docker-compose up -d", ignoreError: false},
        {cmd: "echo '==> Deployment completed successfully'", ignoreError: false},
    }
    // ... execution loop
}
```

**Issues:**
- Hardcoded docker-compose commands (no path to compose file)
- No backup before `docker-compose down`
- No rollback on failure
- Assumes docker-compose file exists on remote server

---

## IMPLEMENTATION PLAN

### PHASE 1: Complete Core Deployment (Week 1-2)

**Priority: CRITICAL**  
**Estimated Time:** 10-12 days

#### 1.1 Create Docker Manager Module
**File:** `internal/docker/manager.go`

```go
package docker

type Manager struct {
    client *ssh.Client
    logger *logrus.Logger
}

// Core functions needed:
- CheckDocker() error                    // Verify Docker/Compose installed
- BackupCurrentState() (*Backup, error)  // Save current container state
- PullImages(composeFile string) error   // Pull new images
- Deploy(config DeployConfig) error      // Main deployment logic
- Rollback(backup *Backup) error         // Restore previous state
- GetContainerStatus() ([]Container, error)
- GetContainerLogs(name string, lines int) (string, error)
```

**Dependencies:**
- SSH client from `internal/config/ssh/`
- Logger from `internal/logger/`

**Tests:** `internal/docker/manager_test.go`
- Unit tests with mocked SSH client
- Test each function independently

---

#### 1.2 Create Workflow Orchestrator
**File:** `internal/workflows/orchestrator.go`

```go
package workflows

type Orchestrator struct {
    dockerMgr *docker.Manager
    config    *model.Deployment
    logger    *logrus.Logger
}

// Deployment workflow:
func (o *Orchestrator) Deploy(opts DeployOptions) error {
    1. Validate configuration
    2. Connect to server(s)
    3. Pre-deployment checks (Docker installed, disk space, etc.)
    4. Create backup (if not --skip-backup)
    5. Execute deployment
    6. Verify deployment success
    7. Run health checks
    8. On failure: auto-rollback
    9. Log deployment history
    return nil
}
```

**Features:**
- Parallel execution for multiple servers (using `sync.errgroup`)
- Progress reporting
- Graceful error handling with cleanup

**Tests:** `internal/workflows/orchestrator_test.go`

---

#### 1.3 Refactor Deploy Command
**File:** `cmd/deploy.go`

**Changes:**
```go
func runDeploy(_ *cobra.Command, args []string) error {
    configFile := args[0]
    
    // Load config
    servers, err := config.LoadConfig(configFile)
    if err != nil {
        return fmt.Errorf("failed to load config: %v", err)
    }
    
    // Create orchestrator
    orchestrator := workflows.NewOrchestrator(
        logger.Log,
        dryRun,
        skipBackup,
    )
    
    // Execute deployment workflow
    results := orchestrator.DeployToServers(servers)
    
    // Report results
    orchestrator.PrintSummary(results)
    
    return nil
}
```

**Remove:**
- Direct SSH logic (delegate to orchestrator)
- Hardcoded docker-compose commands

---

#### 1.4 Implement Deployment History
**File:** `internal/history/tracker.go`

```go
type Deployment struct {
    ID          string
    Timestamp   time.Time
    Server      string
    ImageTag    string
    Status      string // success, failed, rolled_back
    Duration    time.Duration
}

func SaveDeployment(d *Deployment) error
func GetDeploymentHistory(server string, limit int) ([]Deployment, error)
func GetLastSuccessfulDeployment(server string) (*Deployment, error)
```

**Storage:** JSON file in `~/.sail/deployments.json`

---

### PHASE 2: Implement Missing Commands (Week 3)

**Estimated Time:** 5-7 days

#### 2.1 Rollback Command
**File:** `cmd/rollback.go`

```go
var rollbackCmd = &cobra.Command{
    Use:   "rollback [config-file]",
    Short: "Rollback to previous deployment",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        // 1. Load deployment history
        // 2. Find last successful deployment
        // 3. Connect to server
        // 4. Execute rollback using docker manager
        // 5. Verify rollback success
        // 6. Update deployment history
    },
}
```

**Flags:**
- `--to-version`: Rollback to specific deployment ID
- `--dry-run`: Show what would be rolled back

---

#### 2.2 Status Command
**File:** `cmd/status.go`

```go
var statusCmd = &cobra.Command{
    Use:   "status [config-file]",
    Short: "Check deployment status on remote servers",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        // 1. Load servers from config
        // 2. Connect to each server
        // 3. Get container status
        // 4. Display formatted output (table)
        // 5. Show health check status
    },
}
```

**Output Example:**
```
SERVER         CONTAINER        STATUS    UPTIME       HEALTH
ssh-test       sail-api         running   2h 15m       healthy
web-server     myapp-prod       running   5d 3h        healthy
db-server      postgres         running   10d 2h       healthy
```

---

#### 2.3 Logs Command
**File:** `cmd/logs.go`

```go
var logsCmd = &cobra.Command{
    Use:   "logs [config-file]",
    Short: "Fetch container logs from remote server",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        // 1. Load server config
        // 2. Connect to server
        // 3. Fetch logs from specified container
        // 4. Stream to stdout with optional filtering
    },
}
```

**Flags:**
- `--server`: Specify server name
- `--container`: Specify container name
- `--lines, -n`: Number of lines to show (default: 100)
- `--follow, -f`: Stream logs in real-time
- `--since`: Show logs since timestamp

---

### PHASE 3: Comprehensive Testing (Week 4)

**Estimated Time:** 7-10 days

#### 3.1 Unit Test Coverage

**Target: 80%+ coverage**

Files to test:
```
✅ internal/config/loader_test.go        (exists)
✅ internal/config/ssh/client_test.go    (exists)
❌ internal/docker/manager_test.go       (create)
❌ internal/workflows/orchestrator_test.go (create)
❌ internal/history/tracker_test.go      (create)
❌ cmd/deploy_test.go                    (create)
❌ cmd/rollback_test.go                  (create)
❌ cmd/status_test.go                    (create)
❌ cmd/logs_test.go                      (create)
```

**Testing Strategy:**
- Use `testify/mock` for SSH client mocking
- Use `testify/assert` for assertions
- Table-driven tests for multiple scenarios
- Test both success and failure paths

---

#### 3.2 Integration Tests

**File:** `tests/integration_test.go`

**Setup:**
- Use `testcontainers-go` to spin up SSH+Docker test containers
- Create realistic test scenarios

**Test Cases:**
1. Full deployment workflow (end-to-end)
2. Deployment with rollback on failure
3. Multi-server parallel deployment
4. Status checking across multiple servers
5. Log fetching from containers
6. Deployment history tracking

**Execution:**
```bash
go test ./tests/integration_test.go -v -tags=integration
```

---

#### 3.3 GitHub Actions Enhancement

**File:** `.github/workflows/test.yml`

**Updates:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.25'
      
      - name: Run unit tests
        run: go test ./... -v -coverprofile=coverage.out
      
      - name: Check coverage
        run: |
          go tool cover -func=coverage.out
          COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage is below 80%: $COVERAGE%"
            exit 1
          fi
      
      - name: Run integration tests
        run: go test ./tests/integration_test.go -v -tags=integration
      
      - name: Run linter
        uses: golangci/golangci-lint-action@v3

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Build binary
        run: |
          go build -o bin/sail -ldflags="-s -w" .
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: sail-binary
          path: bin/sail
```

---

### PHASE 4: Production Readiness (Week 5)

**Estimated Time:** 5-7 days

#### 4.1 Security Hardening

**Changes:**

1. **SSH Host Key Verification**
   - Replace `ssh.InsecureIgnoreHostKey()` with proper verification
   - Store known hosts in `~/.sail/known_hosts`
   - Prompt user on first connection

2. **Credential Management**
   - Support SSH agent authentication
   - Warn about password authentication in logs
   - Add option to encrypt config.yaml

3. **Least Privilege**
   - Document minimum required permissions for deployment user
   - Add validation for user permissions before deployment

**File:** `internal/security/ssh.go`

---

#### 4.2 Error Handling & Retry Logic

**File:** `internal/retry/retry.go`

```go
type RetryConfig struct {
    MaxAttempts int
    Delay       time.Duration
    Backoff     BackoffStrategy
}

func WithRetry(fn func() error, config RetryConfig) error {
    // Exponential backoff retry logic
}
```

**Apply to:**
- SSH connections
- Docker pull operations
- Network-dependent operations

---

#### 4.3 Observability

**Enhancements:**

1. **Structured Logging**
   ```go
   logger.Log.WithFields(logrus.Fields{
       "server": server.Name,
       "deployment_id": deploymentID,
       "duration_ms": duration,
   }).Info("Deployment completed")
   ```

2. **Metrics Collection**
   - Track deployment success/failure rates
   - Track deployment duration
   - Track rollback frequency

3. **Dry-run Mode**
   - Implement throughout all commands
   - Show exact commands that would be executed

---

#### 4.4 Documentation

**Files to Create/Update:**

1. **API Documentation**
   - `docs/API.md` - Complete command reference
   - `docs/CONFIG.md` - Configuration schema and examples

2. **User Guide**
   - `docs/GETTING_STARTED.md` - Beginner tutorial
   - `docs/DEPLOYMENT_GUIDE.md` - Best practices
   - `docs/TROUBLESHOOTING.md` - Common issues and solutions

3. **Developer Documentation**
   - Update `DEVELOPMENT_GUIDE.md` with current architecture
   - `docs/CONTRIBUTING.md` - Contribution guidelines
   - `docs/ARCHITECTURE.md` - System design documentation

4. **README Updates**
   - Add badges (build status, coverage, version)
   - Add GIF demos of key features
   - Update installation instructions

---

### PHASE 5: Advanced Features (Week 6-7)

**Estimated Time:** 10-14 days

#### 5.1 Pre/Post Deployment Hooks

**Configuration:**
```yaml
deployment:
  container_name: myapp
  hooks:
    pre_deploy:
      - script: ./scripts/backup-db.sh
        timeout: 300
    post_deploy:
      - script: ./scripts/warm-cache.sh
        timeout: 60
    on_failure:
      - script: ./scripts/alert-team.sh
```

**Implementation:** `internal/hooks/executor.go`

---

#### 5.2 Health Checks

**Configuration:**
```yaml
deployment:
  container_name: myapp
  health_check:
    type: http
    endpoint: http://localhost:8080/health
    interval: 10s
    retries: 5
    timeout: 5s
```

**Implementation:** `internal/health/checker.go`

---

#### 5.3 Multi-Environment Support

**Feature:**
- Support for multiple config files (dev, staging, prod)
- Environment-specific overrides
- Secrets management integration

**Example:**
```bash
sail deploy --env production
# Loads: config.production.yaml
```

---

#### 5.4 GoReleaser Integration

**File:** `.goreleaser.yml`

```yaml
project_name: sail

builds:
  - env:
      - CGO_ENABLED=0
    goos:
      - linux
      - darwin
      - windows
    goarch:
      - amd64
      - arm64

archives:
  - format: tar.gz
    name_template: >-
      {{ .ProjectName }}_
      {{- .Os }}_
      {{- .Arch }}

checksum:
  name_template: 'checksums.txt'

release:
  github:
    owner: E-Timileyin
    name: sail

changelog:
  sort: asc
  filters:
    exclude:
      - '^docs:'
      - '^test:'
```

**GitHub Action:** `.github/workflows/release.yml`

---

## TIMELINE SUMMARY

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Core Deployment** | Week 1-2 (10-12 days) | Docker manager, Workflow orchestrator, Refactored deploy command, Deployment history |
| **Phase 2: Missing Commands** | Week 3 (5-7 days) | Rollback, Status, Logs commands |
| **Phase 3: Testing** | Week 4 (7-10 days) | 80%+ test coverage, Integration tests, Enhanced CI/CD |
| **Phase 4: Production Readiness** | Week 5 (5-7 days) | Security hardening, Retry logic, Documentation |
| **Phase 5: Advanced Features** | Week 6-7 (10-14 days) | Hooks, Health checks, Multi-env, GoReleaser |
| **TOTAL** | **37-50 days (~7-10 weeks)** | Full production-ready v1.0.0 |

---

## VERSION ROADMAP

| Version | Target Date | Key Features |
|---------|-------------|--------------|
| **v0.1.0** | Week 2 | MVP - Basic deploy + rollback |
| **v0.2.0** | Week 3 | Status/logs commands |
| **v0.3.0** | Week 4 | Full test coverage |
| **v0.4.0** | Week 5 | Production-ready (security, docs) |
| **v1.0.0** | Week 7 | Stable release with all features |

---

## DEPENDENCIES & RISKS

### External Dependencies
- SSH access to target servers (testing)
- Docker installed on target servers
- GitHub Actions (for CI/CD)
- Docker/testcontainers (for integration tests)

### Risks
1. **SSH Compatibility Issues** - Different SSH servers may behave differently
   - *Mitigation:* Comprehensive integration testing with multiple SSH implementations

2. **Docker Version Differences** - Older Docker versions may not support all commands
   - *Mitigation:* Document minimum Docker version requirements

3. **Network Reliability** - SSH connections may be unstable
   - *Mitigation:* Implement robust retry logic with exponential backoff

4. **Time Estimation** - First-time implementation may take longer
   - *Mitigation:* Buffer added to timeline (7-10 weeks instead of fixed 7)

---

## SUCCESS METRICS

### Code Quality
- [ ] 80%+ test coverage
- [ ] All linter checks pass
- [ ] Zero critical security vulnerabilities
- [ ] All CI/CD checks passing

### Functionality
- [ ] Can deploy to remote servers successfully
- [ ] Can rollback to previous versions
- [ ] Can monitor deployment status
- [ ] Can view container logs
- [ ] Supports multiple servers in parallel

### Documentation
- [ ] Complete API documentation
- [ ] User guides for all features
- [ ] Developer contribution guide
- [ ] Troubleshooting documentation

### Performance
- [ ] Deploy to single server in < 30 seconds
- [ ] Support 10+ parallel server deployments
- [ ] Rollback in < 10 seconds

---

## NEXT STEPS

### Immediate Actions (This Week)

1. **Create missing modules:**
   ```bash
   mkdir -p internal/docker internal/workflows internal/history internal/security internal/retry internal/hooks internal/health
   ```

2. **Start with Docker Manager:**
   - File: `internal/docker/manager.go`
   - File: `internal/docker/manager_test.go`
   - Implement core functions listed in Phase 1.1

3. **Set up project board:**
   - Create GitHub Issues for each phase
   - Add milestones for each version
   - Track progress with project board

4. **Update current deploy command:**
   - Add deployment history tracking
   - Implement basic backup before deploy

### Weekly Check-ins
- Review progress against timeline
- Update this document with actual vs. estimated time
- Adjust priorities based on blockers

---

## MAINTAINER NOTES

**Current Blockers:**
- None (ready to proceed)

**Questions to Resolve:**
- [ ] Should we support Docker Compose v1 vs v2 syntax?
- [ ] What should be the default backup retention policy?
- [ ] Should deployment history be local-only or support remote storage?

**Technical Decisions:**
- Use JSON for deployment history (simple, readable)
- Use exponential backoff for retry logic (industry standard)
- Keep SSH wrapper instead of shelling out to `ssh` command (better control)

---

**Document Status:** ✅ Ready for Review  
**Requires Approval:** Yes  
**Next Review Date:** After Phase 1 completion
