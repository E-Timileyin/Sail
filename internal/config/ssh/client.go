package ssh

import (
	"bytes"
	"fmt"

	"os"
	"time"

	"github.com/E-Timileyin/sail/internal/model"
	"golang.org/x/crypto/ssh"
)

// CommandResult represents the result of an SSH command execution.
type CommandResult struct {
	Command string // The command that was executed
	Status  string // Command status (e.g., "success", "fail")
	Message string // Command output or error message
	Error   error  // Any error that occurred
}

// ExecuteSSHCommand executes a command on a remote server via SSH.
func ExecuteSSHCommand(cfg model.ServerStruct, command string) (*CommandResult, error) {
	result := &CommandResult{
		Command: command,
	}

	// 1. Read and parse private key
	keyBytes, err := os.ReadFile(cfg.KeyPath)
	if err != nil {
		result.Status = "fail"
		result.Error = fmt.Errorf("failed to read private key file: %w", err)
		return result, result.Error
	}

	signer, err := ssh.ParsePrivateKey(keyBytes)
	if err != nil {
		result.Status = "fail"
		result.Error = fmt.Errorf("failed to parse private key: %w", err)
		return result, result.Error
	}

	// 2. Configure SSH client
	config := &ssh.ClientConfig{
		User: cfg.User,
		Auth: []ssh.AuthMethod{
			ssh.PublicKeys(signer),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // In production, use proper host key verification
		Timeout:         15 * time.Second,
	}

	// 3. Connect to the server
	client, err := ssh.Dial("tcp", cfg.Host, config)
	if err != nil {
		result.Status = "fail"
		result.Error = fmt.Errorf("failed to connect to %s: %w", cfg.Host, err)
		return result, result.Error
	}
	defer client.Close()

	// 4. Create a session
	session, err := client.NewSession()
	if err != nil {
		result.Status = "fail"
		result.Error = fmt.Errorf("failed to create session: %w", err)
		return result, result.Error
	}
	defer session.Close()

	// 5. Capture output
	var stdout, stderr bytes.Buffer
	session.Stdout = &stdout
	session.Stderr = &stderr

	// 6. Run the command
	if err := session.Run(command); err != nil {
		result.Status = "fail"
		result.Message = stderr.String()
		result.Error = fmt.Errorf("command failed: %w", err)
		return result, result.Error
	}

	// 7. Return success
	result.Status = "success"
	result.Message = stdout.String()
	return result, nil
}
