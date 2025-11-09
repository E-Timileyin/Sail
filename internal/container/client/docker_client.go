// internal/container/client/docker_client.go
package client

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/E-Timileyin/sail/internal/model"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

// DockerClient is a client for interacting with the Docker daemon
type DockerClient struct {
	cli *client.Client
}

// NewClient creates a new Docker client
func NewClient() (*DockerClient, error) {
	cli, err := client.NewClientWithOpts(
		client.FromEnv,
		client.WithAPIVersionNegotiation(),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create Docker client: %w", err)
	}

	// Test the connection
	ctx := context.Background()
	if _, err = cli.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to connect to Docker daemon: %w", err)
	}

	return &DockerClient{cli: cli}, nil
}

// List lists all containers
func (dc *DockerClient) List(ctx context.Context) ([]model.Container, error) {
	containers, err := dc.cli.ContainerList(ctx, container.ListOptions{All: true})
	if err != nil {
		return nil, fmt.Errorf("failed to list containers: %w", err)
	}

	var result []model.Container
	for _, c := range containers {
		// Clean up container names (they come with leading '/' from Docker)
		var names []string
		for _, n := range c.Names {
			names = append(names, strings.TrimPrefix(n, "/"))
		}

		result = append(result, model.Container{
			ID:     c.ID[:12], // Use short ID
			Image:  c.Image,
			Status: c.Status,
			Names:  names,
		})
	}

	return result, nil
}

// Create creates a new container
func (dc *DockerClient) Create(ctx context.Context, config *model.ContainerConfig) (string, error) {
	// Create container configuration
	containerConfig := &container.Config{
		Image: config.Image,
		Cmd:   config.Cmd,
		Env:   config.Env,
	}

	// Create host configuration
	hostConfig := &container.HostConfig{}

	// Create the container
	resp, err := dc.cli.ContainerCreate(
		ctx,
		containerConfig,
		hostConfig,
		nil,
		nil,
		config.Name,
	)
	if err != nil {
		return "", fmt.Errorf("failed to create container: %w", err)
	}

	return resp.ID, nil
}

// Start starts a container by ID
func (dc *DockerClient) Start(ctx context.Context, containerID string) error {
	return dc.cli.ContainerStart(ctx, containerID, container.StartOptions{})
}

// Stop stops a running container by ID
func (dc *DockerClient) Stop(ctx context.Context, containerID string) error {
	timeout := 5 // seconds
	return dc.cli.ContainerStop(ctx, containerID, container.StopOptions{Timeout: &timeout})
}

// Remove removes a container by ID
func (dc *DockerClient) Remove(ctx context.Context, containerID string) error {
	return dc.cli.ContainerRemove(ctx, containerID, container.RemoveOptions{
		Force: true, // Force remove if container is running
	})
}

// Inspect returns detailed information about a container
func (dc *DockerClient) Inspect(ctx context.Context, containerID string) (*model.ContainerInfo, error) {
	containerJSON, err := dc.cli.ContainerInspect(ctx, containerID)
	if err != nil {
		return nil, fmt.Errorf("failed to inspect container: %w", err)
	}

	// Convert ports to our Port struct
	var ports []model.Port
	for port, bindings := range containerJSON.NetworkSettings.Ports {
		if len(bindings) > 0 {
			for _, binding := range bindings {
				privatePort, _ := strconv.ParseUint(binding.HostPort, 10, 16)
				publicPort, _ := strconv.ParseUint(port.Port(), 10, 16)

				ports = append(ports, model.Port{
					IP:          binding.HostIP,
					PublicPort:  uint16(publicPort),
					PrivatePort: uint16(privatePort),
					Type:        port.Proto(),
				})
			}
		}
	}

	// Clean up container name (it comes with leading '/' from Docker)
	name := strings.TrimPrefix(containerJSON.Name, "/")

	// Parse the Created timestamp
	created, _ := time.Parse(time.RFC3339Nano, containerJSON.Created)

	return &model.ContainerInfo{
		ID:      containerJSON.ID[:12],
		Name:    name,
		Image:   containerJSON.Config.Image,
		Status:  containerJSON.State.Status,
		State:   containerJSON.State.Status,
		Created: created,
		Ports:   ports,
		ImageID: containerJSON.Image,
	}, nil
}

// ListContainer is kept for backward compatibility
// Deprecated: Use List instead
func (dc *DockerClient) ListContainer() ([]model.ContainerInfo, error) {
	containers, err := dc.List(context.Background())
	if err != nil {
		return nil, err
	}

	var result []model.ContainerInfo
	for _, c := range containers {
		info, err := dc.Inspect(context.Background(), c.ID)
		if err != nil {
			continue // Skip containers we can't inspect
		}
		result = append(result, *info)
	}

	return result, nil
}
