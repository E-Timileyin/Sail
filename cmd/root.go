package cmd

import (
	"os"

	"github.com/E-Timileyin/sail/internal/logger"
	"github.com/spf13/cobra"
)

var (
	logLevel  string
	logFormat string
)

var rootCmd = &cobra.Command{
	Use:   "sail",
	Short: "Sail - Docker deployment tool",
	Long: `A lightweight tool for deploying Docker containers with rollback support.
Complete documentation is available at https://github.com/E-Timileyin/Sail`,
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		// Initialize logger before any command runs
		logger.Initialize(logger.Config{
			Level:  logger.Level(logLevel),
			Format: logFormat,
		})
		logger.Log.Info("Sail starting up...")
		return nil
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		if logger.Log != nil {
			logger.Log.Errorf("Command failed: %v", err)
		}
		os.Exit(1)
	}
}
func init() {
	// Global flags
	rootCmd.PersistentFlags().StringVarP(&logLevel, "log-level", "l", "info", "Log level (debug, info, warn, error)")
	rootCmd.PersistentFlags().StringVar(&logFormat, "log-format", "text", "Log format (text or json)")

	// Local flags (only for this command)
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
