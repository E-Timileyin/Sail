package model

import (
	"fmt"
	"os"
	"time"

	"golang.org/x/crypto/ssh"
)

type ServerStruct struct {
	Name     string            `yaml:"name"`
	Host     string            `yaml:"host"`
	Port     int               `yaml:"port"`
	User     string            `yaml:"user"`
	KeyPath  string            `yaml:"key_path"`
	Password string            `yaml:"password,omitempty"`
	Env      map[string]string `yaml:"env,omitempty"`
}

// SSHConfig returns the SSH client configuration
func (s *ServerStruct) SSHConfig() (*ssh.ClientConfig, error) {
	var authMethods []ssh.AuthMethod

	// Try key-based auth first
	if s.KeyPath != "" {
		key, err := os.ReadFile(s.KeyPath)
		if err != nil {
			return nil, fmt.Errorf("unable to read private key: %v", err)
		}

		signer, err := ssh.ParsePrivateKey(key)
		if err != nil {
			return nil, fmt.Errorf("unable to parse private key: %v", err)
		}

		authMethods = append(authMethods, ssh.PublicKeys(signer))
	}

	// Fall back to password auth if no key and password is provided
	if s.Password != "" && len(authMethods) == 0 {
		authMethods = append(authMethods, ssh.Password(s.Password))
	}

	if len(authMethods) == 0 {
		return nil, fmt.Errorf("no authentication method provided")
	}

	return &ssh.ClientConfig{
		User:            s.User,
		Auth:            authMethods,
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // TODO: Implement proper host key verification
		Timeout:         30 * time.Second,
	}, nil
}

// Address returns the server address in host:port format
func (s *ServerStruct) Address() string {
	port := s.Port
	if port == 0 {
		port = 22 // Default SSH port
	}
	return fmt.Sprintf("%s:%d", s.Host, port)
}
