package model

type ServerStruct struct {
	Name    string `yaml:"name"`
	Host    string `yaml:"host"`
	User    string `yaml:"user"`
	Key     string `yaml:"key"`
	Private string `yaml:"private_key"`
}
