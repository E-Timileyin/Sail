package cmd

import (
	"bytes"
	"fmt"

	"github.com/E-Timileyin/sail/internal/config"
	"github.com/E-Timileyin/sail/internal/logger"
	"github.com/E-Timileyin/sail/internal/model"
	"github.com/spf13/cobra"
	"golang.org/x/crypto/ssh"
)

// deployCmd represents the deploy command
var deployCmd = &cobra.Command{
	Use:   "deploy [config-file]",
	Short: "Deploy containers to remote servers",
	Long: `Deploy your application to one or more remote servers using SSH.
The config file should contain server details and deployment settings.`,
	Args: cobra.ExactArgs(1),
	RunE: runDeploy,
}

var (
	dryRun     bool
	skipBackup bool
)

func init() {
	rootCmd.AddCommand(deployCmd)

	// Add flags
	deployCmd.Flags().BoolVar(&dryRun, "dry-run", false, "Show what would be deployed without making changes")
	deployCmd.Flags().BoolVar(&skipBackup, "skip-backup", false, "Skip creating backup of current deployment")
}

func runDeploy(_ *cobra.Command, args []string) error {
	configFile := args[0]
	logger.Log.Infof("Starting deployment using config: %s", configFile)

	// 1. Load server configuration
	servers, err := config.LoadConfig(configFile)
	if err != nil {
		return fmt.Errorf("failed to load config: %v", err)
	}

	// 2. Process each servere
	for i := range servers {
		server := &servers[i]
		logger.Log.Infof("Deploying to server: %s (%s)", server.Name, server.Host)

		// 3. Create SSH client configuration
		sshConfig, err := server.SSHConfig()
		if err != nil {
			logger.Log.Errorf("Failed to create SSH config for %s: %v", server.Name, err)
			continue
		}

		// 4. Connect to the server
		client, err := ssh.Dial("tcp", server.Address(), sshConfig)
		if err != nil {
			logger.Log.Errorf("Failed to connect to %s: %v", server.Address(), err)
			continue
		}
		defer client.Close()

		logger.Log.Infof("Successfully connected to %s", server.Address())

		// 5. Execute deployment commands
		if err := executeDeployment(client, server); err != nil {
			logger.Log.Errorf("Deployment failed on %s: %v", server.Name, err)
			continue
		}

		logger.Log.Infof("Successfully deployed to %s", server.Name)
	}

	return nil
}

// executeDeployment runs the deployment commands on the remote server
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
		{cmd: "docker-compose down", ignoreError: true}, // Ignore error if no containers are running
		{cmd: "docker-compose up -d", ignoreError: false},
		{cmd: "echo '==> Deployment completed successfully'", ignoreError: false},
	}

	for _, cmd := range commands {
		logger.Log.Debugf("Executing: %s", cmd.cmd)

		err := runCommand(client, cmd.cmd)
		if err != nil && !cmd.ignoreError {
			return fmt.Errorf("command failed: %s\nError: %v", cmd.cmd, err)
		}
	}

	// Verify the deployment
	if err := verifyDeployment(client); err != nil {
		return fmt.Errorf("deployment verification failed: %v", err)
	}

	return nil
}

// runCommand executes a single command on the remote server
func runCommand(client *ssh.Client, command string) error {
	session, err := client.NewSession()
	if err != nil {
		return fmt.Errorf("failed to create session: %v", err)
	}
	defer session.Close()

	var stdout, stderr bytes.Buffer
	session.Stdout = &stdout
	session.Stderr = &stderr

	if err := session.Run(command); err != nil {
		return fmt.Errorf("command failed: %s\nSTDOUT: %s\nSTDERR: %s",
			command, stdout.String(), stderr.String())
	}

	logger.Log.Debugf("Command output:\n%s", stdout.String())
	if stderr.Len() > 0 {
		logger.Log.Warnf("Command warnings/errors:\n%s", stderr.String())
	}

	return nil
}

// verifyDeployment checks if the deployment was successful
func verifyDeployment(client *ssh.Client) error {
	// Check if containers are running
	if err := runCommand(client, "docker ps --filter 'status=running' --format '{{.Names}}'"); err != nil {
		return fmt.Errorf("failed to check running containers: %v", err)
	}

	// You can add more verification steps here, for example:
	// 1. Check if specific services are running
	// 2. Make HTTP requests to verify endpoints
	// 3. Check container logs for errors

	return nil
}
