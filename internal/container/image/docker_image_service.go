package image

import (
	"context"
	"fmt"
	"io"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

// dockerImageService implements the Service interface using Docker client
type dockerImageService struct {
	cli *client.Client
}

// NewService creates a new Docker image service instance
func NewService(cli *client.Client) Service {
	return &dockerImageService{
		cli: cli,
	}
}

// ImagePull pulls a Docker image from a registry and returns a reader for the pull progress
func (s *dockerImageService) ImagePull(ctx context.Context, refStr string, options PullOptions) (io.ReadCloser, error) {
	pullOpts := image.PullOptions{
		All:          false,
		RegistryAuth: options.AuthConfig,
		Platform:     options.Platform,
	}

	return s.cli.ImagePull(ctx, refStr, pullOpts)
}

// List returns all Docker images available on the host
func (s *dockerImageService) List(ctx context.Context) ([]Image, error) {
	images, err := s.cli.ImageList(ctx, image.ListOptions{All: true})
	if err != nil {
		return nil, fmt.Errorf("failed to list images: %w", err)
	}

	result := make([]Image, 0, len(images))
	for _, img := range images {
		result = append(result, Image{
			ID:       img.ID,
			RepoTags: img.RepoTags,
			Size:     img.Size,
			Created:  img.Created,
		})
	}

	return result, nil
}

// Remove deletes a Docker image, with an option to force removal
func (s *dockerImageService) Remove(ctx context.Context, imageID string, force bool) error {
	_, err := s.cli.ImageRemove(ctx, imageID, image.RemoveOptions{
		Force:         force,
		PruneChildren: true,
	})

	if err != nil {
		return fmt.Errorf("failed to remove image %s: %w", imageID, err)
	}

	return nil
}
