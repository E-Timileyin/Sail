
---

# ⚓ Sail — Automated Docker Deployment CLI

A fast, secure, and flexible CLI tool for **deploying Dockerized applications to remote servers via SSH**.
Built with **Go**, **Cobra**, and **Viper**, `Sail` automates container updates, rollbacks, and monitoring.

---

## 🚀 Quick Start

### Prerequisites

- Go 1.16+
- Docker installed on target servers
- SSH access to target servers
- A Dockerized application with a `docker-compose.yml` file

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sail.git
   cd sail
   ```

2. Build the binary:
   ```bash
   go build -o sail
   ```

3. Make it executable:
   ```bash
   chmod +x sail
   ```

4. (Optional) Move to a directory in your PATH:
   ```bash
   sudo mv sail /usr/local/bin/
   ```

## 🚀 Usage

### 1. Configuration

Create a `config.yaml` file in your project root:

```yaml
app:
  name: my-awesome-app
  environment: production

deployment:
  container_name: my-app
  dockerfile: ./Dockerfile
  port: 3000

servers:
  - name: production
    host: your-server-ip
    port: 22
    user: deploy
    # Use either password or private_key_path
    password: your-ssh-password
    # private_key_path: ~/.ssh/id_rsa
```

### 2. Deploy Your Application

```bash
# Basic deployment
./sail deploy config.yaml

# Dry run (show what would be deployed)
./sail deploy config.yaml --dry-run

# Skip backup of current deployment
./sail deploy config.yaml --skip-backup
```

### 3. Check Deployment Status

```bash
# View container status
./sail status config.yaml

# View container logs
./sail logs config.yaml
```

### 4. Rollback (if needed)

```bash
# Rollback to previous version
./sail rollback config.yaml
```

## 🔧 Configuration Reference

### Server Configuration

| Field            | Required | Description                                     |
|------------------|----------|-------------------------------------------------|
| `name`           | Yes      | A name to identify this server                  |
| `host`           | Yes      | Server hostname or IP address                   |
| `port`           | No       | SSH port (default: 22)                          |
| `user`           | Yes      | SSH username                                    |
| `password`       | No*      | SSH password (either this or private_key_path)  |
| `private_key_path`| No*      | Path to SSH private key (e.g., ~/.ssh/id_rsa)   |

> *Note: You must provide either `password` or `private_key_path`

### Deployment Configuration

| Field             | Required | Description                                      |
|-------------------|----------|--------------------------------------------------|
| `container_name`  | Yes      | Name of your Docker container                    |
| `dockerfile`      | No       | Path to Dockerfile (default: ./Dockerfile)       |
| `port`            | No       | Port your application runs on (default: 80)      |

## 🔒 Security Best Practices

1. **Use SSH Keys**: Always prefer SSH key authentication over passwords
2. **Environment Variables**: Store sensitive data in environment variables or use a secrets manager
3. **Least Privilege**: Use a dedicated deployment user with minimal required permissions
4. **Firewall**: Ensure only necessary ports are open on your server
5. **Regular Updates**: Keep Docker and your system packages up to date

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker not installed on target server
```
Error: docker is not installed on the server: command failed: docker --version
```
**Solution**: Install Docker on the target server:
```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl enable --now docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker  # Apply group changes
```

#### 2. Permission denied (publickey)
```
Failed to connect: ssh: handshake failed: ssh: unable to authenticate...
```
**Solution**:
- Verify your SSH credentials
- Ensure the private key has correct permissions:
  ```bash
  chmod 600 ~/.ssh/id_rsa
  ```
- If using password authentication, ensure the user has login permissions

#### 3. Port already in use
```
Error: Port 80 is already in use
```
**Solution**:
- Stop the conflicting service:
  ```bash
  sudo lsof -i :80  # Find the process using port 80
  sudo systemctl stop nginx  # Example: if nginx is running
  ```
- Or configure your application to use a different port

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
│   └── logger/           # Logging utilities
│       └── logger.go
│
├── configs/
│   ├── servers.yaml      # List of target servers
│   └── .env              # Environment variables
│
├── README.md
│   ├── usage.md          # Comprehensive usage guide