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

## 📦 Installation

There are two ways to install and use Sail.

### Option 1: As a CLI Tool (Recommended)

If you have Go installed, you can install the `sail` command directly from GitHub:

```bash
# Install the latest version
go install github.com/E-Timileyin/sail@latest

# Verify the installation
sail --version
```

This will download the source, compile it, and place the `sail` binary in your Go bin directory (`$GOPATH/bin`).

### Option 2: From Source

If you prefer to build from the source code yourself:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/E-Timileyin/Sail.git
    cd Sail
    ```

2.  **Build the binary:**
    ```bash
    go build -o sail .
    ```

3.  **Run the executable:**
    ```bash
    ./sail --help
    ```

4.  **(Optional) Move it to your PATH:**
    ```bash
    sudo mv sail /usr/local/bin/
    ```

## 🚀 Usage

### 1. Configuration

Create a `servers.yaml` file to define your target servers:

```yaml
# servers.yaml
- name: production
  host: your-server-ip
  port: 22
  user: deploy
  key_path: ~/.ssh/your_private_key
```

### 2. Deployment Configuration

Create a `deployment.yaml` file to define your application's deployment settings:

```yaml
# deployment.yaml
image: your-docker-image
tag: latest
containerName: my-app-container
ports:
  "8080": "80"
environment:
  NODE_ENV: "production"
  API_KEY: "your-secret-key"
restartPolicy: "unless-stopped" # Can be: always, unless-stopped, on-failure, no
```

### 2. Basic Commands

```bash
# Deploy your application
./sail deploy deployment.yaml

# Start the application locally
./sail serve deployment.yaml

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

## 🧪 Testing

To run the project's test suite, execute the following command from the root directory:

```bash
go test -v ./...
```

This will run all unit and integration tests and provide detailed output.

## 🔧 Features

- **Automated Deployments**: Deploy your Docker containers with a single command.
- **Automatic Rollbacks**: Automatically reverts to the last known good version if a deployment fails.
- **SSH Integration**: Secure server access with SSH key or password authentication.
- **Environment Management**: Manage different environments (dev, staging, production).
- **Lightweight**: No heavy CI/CD setup required.

### Upcoming Features

- **Enhanced Health Checks**: Implement more robust, application-level health checks.
- **Deployment History**: Track and list past deployments.
- **Improved Testing**: Increase test coverage with integration and mocked tests.
- **Secure SSH**: Remove `ssh.InsecureIgnoreHostKey()` in favor of proper host key verification.
- **Pre/Post Deployment Hooks**: Allow users to run custom scripts before and after deployments.

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