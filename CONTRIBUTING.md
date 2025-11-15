# Contributing to Sail

First off, thank you for considering contributing to Sail! It's people like you that make Sail such a great tool.

Before you get started, please be sure to read the main [README.md](README.md) for an overview of the project.

## Where to Contribute

We have a lot of exciting features planned! If you're looking for a place to start, check out these areas:

- **Improve Test Coverage**: We need more unit and integration tests. Adding tests for the `docker` and `workflows` packages would be a great contribution.
- **Implement New Commands**: The backend logic for `status` and `logs` is in place, but the CLI commands need to be created.
- **Enhance Security**: Help us replace `ssh.InsecureIgnoreHostKey()` with a more secure method of host key verification.
- **Build New Features**: We have many ideas for new features. Here are a few to get you started:
    - **Deployment History**: A command to view a list of past deployments.
    - **Enhanced Health Checks**: Go beyond simple container status checks to verify application-level health (e.g., hitting a `/health` endpoint).
    - **Pre/Post Deployment Hooks**: Allow users to run custom scripts before and after a deployment.
    - **Advanced Deployment Strategies**: Implement blue-green or canary deployment workflows.
    - **Secrets Management**: Integrate with a secrets manager like HashiCorp Vault or AWS Secrets Manager.
    - **Notifications**: Add support for sending deployment status notifications to Slack, Discord, or email.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue and provide the following:

- A clear and descriptive title.
- A detailed description of the problem, including steps to reproduce it.
- The version of Sail you're using (`sail --version`).
- Any relevant logs or error messages.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement, please open an issue to discuss it. This allows us to coordinate our efforts and prevent duplication of work.

### Pull Requests

We welcome pull requests! Here's how to submit one:

1.  **Fork the repository** and create your branch from `main`.
2.  **Make your changes**. Ensure your code follows the project's coding style.
3.  **Add tests** for any new functionality.
4.  **Update the documentation** if you've added or changed any features.
5.  **Ensure your code lints** (`golangci-lint run`).
6.  **Open a pull request** with a clear description of your changes.

## Coding Style

- We follow the standard Go formatting (`gofmt`).
- Strive for simple, readable, and maintainable code.
- Add comments to explain complex logic.

Thank you for helping us make Sail better!
