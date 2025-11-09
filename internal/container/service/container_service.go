// internal/container/service/container_service.go
package service

import (
	"context"

	"github.com/E-Timileyin/sail/internal/container/client"
	"github.com/E-Timileyin/sail/internal/model"
)

// ContainerService implements the Service interface
type ContainerService struct {
	client DockerClient
}

// DockerClient defines the interface for container operations
type DockerClient interface {
	List(ctx context.Context) ([]model.Container, error)
	Create(ctx context.Context, config *model.ContainerConfig) (string, error)
	Start(ctx context.Context, containerID string) error
	Stop(ctx context.Context, containerID string) error
	Remove(ctx context.Context, containerID string) error
	Inspect(ctx context.Context, containerID string) (*model.ContainerInfo, error)
}

// NewContainerService creates a new ContainerService
func NewContainerService() (*ContainerService, error) {
	cli, err := client.NewClient()
	if err != nil {
		return nil, err
	}
	return NewContainerServiceWithClient(cli), nil
}

// NewContainerServiceWithClient creates a new ContainerService with the provided client
func NewContainerServiceWithClient(client DockerClient) *ContainerService {
	return &ContainerService{client: client}
}

// List returns all containers
func (s *ContainerService) List(ctx context.Context) ([]model.Container, error) {
	return s.client.List(ctx)
}

// Create creates a new container
func (s *ContainerService) Create(ctx context.Context, config *model.ContainerConfig) (string, error) {
	return s.client.Create(ctx, config)
}

// Start starts a container
func (s *ContainerService) Start(ctx context.Context, containerID string) error {
	return s.client.Start(ctx, containerID)
}

// Stop stops a container
func (s *ContainerService) Stop(ctx context.Context, containerID string) error {
	return s.client.Stop(ctx, containerID)
}

// Remove removes a container
func (s *ContainerService) Remove(ctx context.Context, containerID string) error {
	return s.client.Remove(ctx, containerID)
}

// Inspect returns detailed information about a container
func (s *ContainerService) Inspect(ctx context.Context, containerID string) (*model.ContainerInfo, error) {
	return s.client.Inspect(ctx, containerID)
}
