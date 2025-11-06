package model

// what is been deployed
type Deployment struct {
	Server    ServerStruct
	Container string `yaml:"container"`
	Image     string `yaml:"image"`
	Tag       string
	EnvFile   string `yaml:"env_file"`

	Ports   []string `yaml:"ports,omitempty" json:"ports,omitempty"`
	Volumes []string `yaml:"volumes,omitempty" json:"volumes,omitempty"`

	RestartPolicy string `yaml:"restart_policy,omitempty" json:"restart_policy,omitempty"`
}
