package container

import (
	"fmt"

	"github.com/E-Timileyin/sail/internal/container/image"
	containersvc "github.com/E-Timileyin/sail/internal/container/service"
	dockerclient "github.com/docker/docker/client"
)

type Manager struct {
	client    *dockerclient.Client // Docker client
	container *containersvc.ContainerService
	image     image.Service
}

func NewManager() (*Manager, error) {
	// Create Docker client
	dockerCli, err := dockerclient.NewClientWithOpts(dockerclient.FromEnv, dockerclient.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create Docker client: %w", err)
	}

	// Initialize container service
	containerSvc, err := containersvc.NewContainerService()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize container service: %w", err)
	}

	// Initialize image service with Docker client
	imgSvc := image.NewService(dockerCli)

	return &Manager{
		client:    dockerCli,
		container: containerSvc,
		image:     imgSvc,
	}, nil
}
