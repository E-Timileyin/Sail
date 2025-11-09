package image

import (
	"context"
	"io"
)

// PullOptions contains optional parameters for the ImagePull operation
type PullOptions struct {
	// All attempts to pull all image metadata
	All bool `json:"all,omitempty"`
	// AuthConfig contains authentication credentials for the registry
	AuthConfig string `json:"registryauth,omitempty"`
	// Platform is the target platform of the image (e.g., "linux/amd64")
	Platform string `json:"platform,omitempty"`
}

// Image represents a Docker image
// Image represents a Docker image
type Image struct {
	ID       string   `json:"id"`
	RepoTags []string `json:"repo_tags,omitempty"`
	Size     int64    `json:"size,omitempty"`
	Created  int64    `json:"created,omitempty"`
}

// Service defines the interface for Docker image operations
type Service interface {
	// ImagePull pulls a Docker image and returns a ReadCloser for the pull progress
	ImagePull(ctx context.Context, refStr string, options PullOptions) (io.ReadCloser, error)
	// List retrieves all Docker images
	List(ctx context.Context) ([]Image, error)
	// Remove deletes a Docker image
	Remove(ctx context.Context, imageID string, force bool) error
}
