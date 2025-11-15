package model

// Deployment represents a deployment configuration
type Deployment struct {
	Server        ServerStruct          `yaml:"server"`
	ContainerName string                `yaml:"container_name"`
	Image         string                `yaml:"image"`
	Tag           string                `yaml:"tag"`
	EnvFile       string                `yaml:"env_file"`
	Environment   map[string]string     `yaml:"environment,omitempty"`
	Ports         map[string]string     `yaml:"ports,omitempty"`
	Volumes       []string              `yaml:"volumes,omitempty"`
	RestartPolicy string                `yaml:"restart_policy,omitempty"`
	HealthCheck   *ContainerHealthCheck `yaml:"health_check,omitempty"`
}

// ContainerHealthCheck defines the health check configuration for a container
type ContainerHealthCheck struct {
	Test        []string `yaml:"test,omitempty"`
	Interval    string   `yaml:"interval,omitempty"`
	Timeout     string   `yaml:"timeout,omitempty"`
	Retries     int      `yaml:"retries,omitempty"`
	StartPeriod string   `yaml:"start_period,omitempty"`
}
