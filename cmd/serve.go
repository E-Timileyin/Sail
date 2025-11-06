package cmd

import (
	"fmt"

	"github.com/E-Timileyin/sail/internal/config"
	"github.com/E-Timileyin/sail/internal/logger"
	"github.com/spf13/cobra"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the sail server",
	Long:  `Start the sail server with the loaded configuration`,
	RunE: func(cmd *cobra.Command, args []string) error {
		logger.Log.Info("Loading server configuration...")
		servers, err := config.LoadConfig()
		if err != nil {
			logger.Log.Errorf("Failed to load config: %v", err)
			return fmt.Errorf("failed to load config: %w", err)
		}

		// Log server information
		logger.Log.Infof("Found %d server(s) in configuration", len(servers))
		for i, server := range servers {
			logger.Log.Debugf("Server %d: %+v", i+1, server)
		}

		logger.Log.Info("Starting server...")
		// Your server startup code will go here

		logger.Log.Info("Server started successfully")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serveCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// serveCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
