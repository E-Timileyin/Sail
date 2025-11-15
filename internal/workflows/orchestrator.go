package workflows

import (
	"context"
	"fmt"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/go-connections/nat"
	"github.com/sirupsen/logrus"
	"github.com/E-Timileyin/sail/internal/docker"
	"github.com/E-Timileyin/sail/internal/model"
)

type Orchestrator struct {
	dockerMgr *docker.Manager
	logger    *logrus.Logger
}

// NewOrchestrator creates a new deployment orchestrator
func NewOrchestrator(logger *logrus.Logger, dockerMgr *docker.Manager) *Orchestrator {
	return &Orchestrator{
		dockerMgr: dockerMgr,
		logger:    logger,
	}
}

// Deploy deploys a new version of the application
func (o *Orchestrator) Deploy(ctx context.Context, config *model.Deployment) error {
	o.logger.Info("Starting deployment process")

	// 1. Validate configuration
	if err := o.validateConfig(config); err != nil {
		return fmt.Errorf("invalid configuration: %w", err)
	}

	// 2. Check Docker environment
	if err := o.dockerMgr.CheckDocker(ctx); err != nil {
		return fmt.Errorf("docker environment check failed: %w", err)
	}

	// 3. Pull the new image
	imageRef := config.Image
	if config.Tag != "" {
		imageRef = fmt.Sprintf("%s:%s", config.Image, config.Tag)
	}

	if err := o.dockerMgr.PullImage(ctx, imageRef); err != nil {
		return fmt.Errorf("failed to pull image: %w", err)
	}

	// 4. Create container configuration
	envVars := []string{}
	for k, v := range config.Environment {
		envVars = append(envVars, fmt.Sprintf("%s=%s", k, v))
	}

	containerConfig := &container.Config{
		Image: imageRef,
		Env:   envVars,
	}

	// Set up port bindings
	portBindings, err := o.getPortBindings(config)
	if err != nil {
		return fmt.Errorf("failed to configure port bindings: %w", err)
	}

	// Set default restart policy if not specified
	restartPolicy := container.RestartPolicy{Name: "unless-stopped"}
	if config.RestartPolicy != "" {
		switch config.RestartPolicy {
		case "always":
			restartPolicy.Name = "always"
		case "unless-stopped":
			restartPolicy.Name = "unless-stopped"
		case "on-failure":
			restartPolicy.Name = "on-failure"
		case "no":
			restartPolicy.Name = "no"
		default:
			o.logger.Warnf("Invalid restart policy: %s, using 'unless-stopped'", config.RestartPolicy)
		}
	}

	hostConfig := &container.HostConfig{
		RestartPolicy: restartPolicy,
		PortBindings: portBindings,
	}

	// 5. Backup existing container if it exists
	backupContainerName := fmt.Sprintf("%s-backup", config.ContainerName)
	status, _ := o.dockerMgr.ContainerStatus(ctx, config.ContainerName)
	if status != "not found" {
		o.logger.Infof("Backing up existing container to %s", backupContainerName)
		if err := o.dockerMgr.StopContainer(ctx, config.ContainerName); err != nil {
			o.logger.Warnf("Failed to stop existing container: %v", err)
		}
		if err := o.dockerMgr.RenameContainer(ctx, config.ContainerName, backupContainerName); err != nil {
			return fmt.Errorf("failed to back up container: %w", err)
		}
	}

	// 6. Create and start the new container
	if _, err := o.dockerMgr.CreateContainer(ctx, config.ContainerName, imageRef, containerConfig, hostConfig); err != nil {
		return fmt.Errorf("failed to create container: %w", err)
	}

	if err := o.dockerMgr.StartContainer(ctx, config.ContainerName); err != nil {
		// If start fails, attempt to rollback
		o.logger.Errorf("Failed to start new container: %v. Rolling back...", err)
		if rollbackErr := o.Rollback(ctx, config); rollbackErr != nil {
			o.logger.Errorf("Rollback failed: %v", rollbackErr)
		}
		return fmt.Errorf("failed to start container: %w", err)
	}

	// 7. Verify deployment
	if err := o.verifyDeployment(ctx, config); err != nil {
		// If verification fails, attempt to rollback
		o.logger.Errorf("Deployment verification failed: %v. Rolling back...", err)
		if rollbackErr := o.Rollback(ctx, config); rollbackErr != nil {
			o.logger.Errorf("Rollback failed: %v", rollbackErr)
		}
		return fmt.Errorf("deployment verification failed: %w", err)
	}

	// 8. Clean up backup container
	o.logger.Info("Deployment successful, removing backup container")
	if err := o.dockerMgr.RemoveContainer(ctx, backupContainerName); err != nil {
		o.logger.Warnf("Failed to remove backup container: %v", err)
	}

	o.logger.Info("Deployment completed successfully")
	return nil
}

// Rollback reverts to the previous version
func (o *Orchestrator) Rollback(ctx context.Context, config *model.Deployment) error {
	o.logger.Info("Starting rollback process")

	// 1. Stop and remove the current failed container
	if err := o.dockerMgr.StopContainer(ctx, config.ContainerName); err != nil {
		o.logger.Warnf("Failed to stop current container during rollback: %v", err)
	}
	if err := o.dockerMgr.RemoveContainer(ctx, config.ContainerName); err != nil {
		o.logger.Warnf("Failed to remove current container during rollback: %v", err)
	}

	// 2. Restore the backup container
	backupContainerName := fmt.Sprintf("%s-backup", config.ContainerName)
	status, _ := o.dockerMgr.ContainerStatus(ctx, backupContainerName)
	if status == "not found" {
		return fmt.Errorf("no backup container found to roll back to")
	}

	o.logger.Infof("Restoring backup container %s", backupContainerName)
	if err := o.dockerMgr.RenameContainer(ctx, backupContainerName, config.ContainerName); err != nil {
		return fmt.Errorf("failed to restore backup container: %w", err)
	}
	if err := o.dockerMgr.StartContainer(ctx, config.ContainerName); err != nil {
		return fmt.Errorf("failed to start restored container: %w", err)
	}

	o.logger.Info("Rollback completed successfully")
	return nil
}

// GetStatus returns the current deployment status
func (o *Orchestrator) GetStatus(ctx context.Context, containerName string) (string, error) {
	return o.dockerMgr.ContainerStatus(ctx, containerName)
}

// GetLogs retrieves logs for the container
func (o *Orchestrator) GetLogs(ctx context.Context, containerName string, lines int) (string, error) {
	return o.dockerMgr.GetContainerLogs(ctx, containerName, lines)
}

// Helper functions
func (o *Orchestrator) validateConfig(config *model.Deployment) error {
	if config == nil {
		return fmt.Errorf("configuration cannot be nil")
	}

	if config.Image == "" {
		return fmt.Errorf("image name is required")
	}

	if config.ContainerName == "" {
		return fmt.Errorf("container name is required")
	}

	return nil
}

func (o *Orchestrator) getEnvironmentVariables(config *model.Deployment) []string {
	var envVars []string
	for key, value := range config.Environment {
		envVars = append(envVars, fmt.Sprintf("%s=%s", key, value))
	}
	return envVars
}

func (o *Orchestrator) getPortBindings(config *model.Deployment) (nat.PortMap, error) {
	portBindings := nat.PortMap{}

	for containerPort, hostPort := range config.Ports {
		port, err := nat.NewPort("tcp", containerPort)
		if err != nil {
			o.logger.Warnf("Invalid container port %s: %v", containerPort, err)
			continue
		}

		portBindings[port] = []nat.PortBinding{
			{
				HostIP:   "0.0.0.0",
				HostPort: hostPort,
			},
		}
	}

	return portBindings, nil
}

func (o *Orchestrator) verifyDeployment(ctx context.Context, config *model.Deployment) error {
	// Add health check verification here
	// For now, just wait a moment for the container to start
	time.Sleep(5 * time.Second)
	
	status, err := o.dockerMgr.ContainerStatus(ctx, config.ContainerName)
	if err != nil {
		return fmt.Errorf("failed to verify container status: %w", err)
	}

	if status != "running" {
		return fmt.Errorf("container is not running, status: %s", status)
	}

	return nil
}
