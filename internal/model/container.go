package model

import "time"

// Container represents basic container information
type Container struct {
	ID     string   `json:"id"`
	Image  string   `json:"image"`
	Status string   `json:"status"`
	Names  []string `json:"names"`
}

// ContainerConfig holds configuration for creating a container
type ContainerConfig struct {
	Image string   `json:"image"`
	Name  string   `json:"name"`
	Env   []string `json:"env,omitempty"`
	Cmd   []string `json:"cmd,omitempty"`
}

// ContainerInfo represents detailed information about a container
type ContainerInfo struct {
	ID      string    `json:"id"`
	Name    string    `json:"name"`
	Image   string    `json:"image"`
	Status  string    `json:"status"`
	State   string    `json:"state"`
	Created time.Time `json:"created"`
	Ports   []Port    `json:"ports,omitempty"`
	ImageID string    `json:"image_id,omitempty"`
}

// Port represents a network port mapping
type Port struct {
	IP          string `json:"ip,omitempty"`
	PrivatePort uint16 `json:"private_port"`
	PublicPort  uint16 `json:"public_port,omitempty"`
	Type        string `json:"type"`
}
