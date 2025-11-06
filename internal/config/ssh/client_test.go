package ssh

import (
	"net"
	"testing"
	"time"

	"github.com/E-Timileyin/sail/internal/model"
	"github.com/stretchr/testify/assert"
)

func TestExecuteSSHCommand(t *testing.T) {
	// Skip if running in short mode
	if testing.Short() {
		t.Skip("Skipping SSH test in short mode")
	}

	// Test configuration
	cfg := model.ServerStruct{
		Host:    "localhost:2222", // Assuming test SSH server runs on port 2222
		User:    "testuser",
		Private: "test-private-key",
	}

	// Check if SSH server is available
	if !isSSHServerAvailable(cfg.Host) {
		t.Skipf("SSH server not available at %s, skipping test", cfg.Host)
	}

	t.Run("successful command execution", func(t *testing.T) {
		result, err := ExecuteSSHCommand(cfg, "echo 'hello'")

		assert.NoError(t, err)
		assert.Equal(t, "success", result.Status)
		assert.Contains(t, result.Message, "hello")
		assert.Equal(t, "echo 'hello'", result.Command)
	})

	t.Run("command with output", func(t *testing.T) {
		result, err := ExecuteSSHCommand(cfg, "uname -a")

		assert.NoError(t, err)
		assert.Equal(t, "success", result.Status)
		assert.NotEmpty(t, result.Message)
		assert.Equal(t, "uname -a", result.Command)
	})

	t.Run("invalid command", func(t *testing.T) {
		result, err := ExecuteSSHCommand(cfg, "non-existent-command")

		assert.Error(t, err)
		assert.Equal(t, "fail", result.Status)
		assert.Contains(t, err.Error(), "failed to run command")
		assert.Equal(t, "non-existent-command", result.Command)
	})

	t.Run("empty command", func(t *testing.T) {
		result, err := ExecuteSSHCommand(cfg, "")

		assert.Error(t, err)
		assert.Equal(t, "fail", result.Status)
		assert.Contains(t, err.Error(), "empty command")
	})
}

// isSSHServerAvailable checks if an SSH server is listening on the given address
func isSSHServerAvailable(addr string) bool {
	timeout := 2 * time.Second
	conn, err := net.DialTimeout("tcp", addr, timeout)
	if err != nil {
		return false
	}
	if conn != nil {
		conn.Close()
		return true
	}
	return false
}
