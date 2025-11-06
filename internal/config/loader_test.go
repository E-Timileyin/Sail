package config_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/E-Timileyin/sail/internal/config"
	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	// Setup test config file
	testConfig := `
servers:
  - name: test-server
    host: test.example.com
    user: testuser
    key: /path/to/key
    private_key: test-key
`

	// Create a temporary directory for the test
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "config.yaml")
	err := os.WriteFile(configPath, []byte(testConfig), 0644)
	if err != nil {
		t.Fatalf("Failed to create test config: %v", err)
	}

	// Set up environment to point to our test config
	oldConfigPath := os.Getenv("CONFIG_PATH")
	defer os.Setenv("CONFIG_PATH", oldConfigPath)
	os.Setenv("CONFIG_PATH", tmpDir)

	// Change working directory to the temp dir
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get current working directory: %v", err)
	}
	os.Chdir(tmpDir)
	defer os.Chdir(oldWd)

	// Test loading config
	servers, err := config.LoadConfig()

	// Assertions
	assert.NoError(t, err, "LoadConfig should not return an error")
	assert.Len(t, servers, 1, "Should load one server configuration")
	assert.Equal(t, "test-server", servers[0].Name, "Server name should match")
	assert.Equal(t, "test.example.com", servers[0].Host, "Host should match")
	assert.Equal(t, "testuser", servers[0].User, "User should match")
}
