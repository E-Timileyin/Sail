package types

import (
	"context"
	"time"
)

// ContainerConfig holds the configuration for a container
type ContainerConfig struct {
	ID            int
	Name          string
	Image         string
	Ports         map[string]string
	EnvVars       map[string]string
	Volumes       map[string]string
	Network       string
	RestartPolicy string

	CreatedAt time.Time
	UpdatedAt time.Time
	// Add other container-specific configurations
}

// DeploymentOptions holds options for the deployment
type DeploymentOptions struct {
	Timeout           time.Duration
	HealthCheck       *HealthCheckConfig
	RollbackOnFailure bool
	// Add other deployment-specific options
}

// HealthCheckConfig defines health check parameters
type HealthCheckConfig struct {
	Cmd         []string
	Interval    time.Duration
	Timeout     time.Duration
	Retries     int
	StartPeriod time.Duration
}

// ContainerManager defines the interface for container operations
type ContainerManager interface {
	Deploy(ctx context.Context, config *ContainerConfig, opts *DeploymentOptions) error
	Rollback(ctx context.Context, containerID string) error
	GetStatus(ctx context.Context, containerID string) (string, error)
	GetLogs(ctx context.Context, containerID string, follow bool) (string, error)
}
