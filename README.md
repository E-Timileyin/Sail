---

# ⚓ Sail — Automated Docker Deployment CLI

A fast, secure, and flexible CLI tool for **deploying Dockerized applications to remote servers via SSH**.
Built with **Go**, **Cobra**, and **Viper**, `Sail` automates container updates, rollbacks, and monitoring.

---

## 🚀 Quick Start

### Prerequisites

- Go 1.16+
- Docker and Docker Compose installed on target servers
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
  environment: production  # or development, staging, etc.

deployment:
  container_name: my-app
  dockerfile: ./Dockerfile
  port: 3000  # Your application's port

servers:
  - name: production
    host: your-server-ip
    port: 22
    user: deploy
    # Use either password or key_path
    # password: your-ssh-password
    key_path: ~/.ssh/your_private_key
```

### 2. Basic Commands

```bash
# Deploy your application
./sail deploy config.yaml

# Start the application locally
./sail serve config.yaml

# SSH into the configured server
./sail ssh production  # Uses the server name from config

# Show version information
./sail --version
```

### 3. Advanced Deployment Options

```bash
# Dry run (show what would be deployed)
./sail deploy config.yaml --dry-run

# Skip backup of current deployment
./sail deploy config.yaml --skip-backup

# Force rebuild of Docker image
./sail deploy config.yaml --force-rebuild
```

## 🔧 Features

- **Automated Deployments** - Deploy your Docker containers with a single command
- **SSH Integration** - Secure server access with SSH key or password authentication
- **Environment Management** - Manage different environments (dev, staging, production)
- **Container Management** - Built-in support for Docker and Docker Compose
- **Lightweight** - No heavy CI/CD setup required

## 🚧 Project Status

This project is currently in **active development** (Phase 1: Core System Setup - 85% complete).

### Upcoming Features
- [ ] Rollback functionality
- [ ] Container health checks
- [ ] Deployment history
- [ ] Comprehensive logging
- [ ] Webhook support

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

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.