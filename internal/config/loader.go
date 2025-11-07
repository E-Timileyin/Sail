package config

import (
	"fmt"

	"github.com/E-Timileyin/sail/internal/model"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

// LoadConfig loads the server configuration from the specified YAML file.
// If configFile is empty, it looks for a file named "config.yaml" in the current directory.
func LoadConfig(configFile string) ([]model.ServerStruct, error) {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

	// Set up Viper
	viper.SetConfigType("yaml")
	
	if configFile != "" {
		// Use the provided config file
		viper.SetConfigFile(configFile)
	} else {
		// Default to config.yaml in the current directory
		viper.SetConfigName("config")
		viper.AddConfigPath(".")
	}

	// Find and read config file
	err := viper.ReadInConfig()
	if err != nil {
		return nil, fmt.Errorf("fatal error config file: %w", err)
	}

	// Unmarshal config into server struct
	var servers []model.ServerStruct
	if err := viper.UnmarshalKey("servers", &servers); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config file: %w", err)
	}

	if len(servers) == 0 {
		return nil, fmt.Errorf("no servers found in config")
	}

	return servers, nil
}
