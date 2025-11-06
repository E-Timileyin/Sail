package config

import (
	"fmt"

	"github.com/E-Timileyin/sail/internal/model"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func LoadConfig() ([]model.ServerStruct, error) {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

	// Set up Viper
	viper.SetConfigName("config") // name of config file (without extension)
	viper.SetConfigType("yaml")   // REQUIRED if the config file does not have the extension in the name
	viper.AddConfigPath(".")      // look for config in the working directory

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
