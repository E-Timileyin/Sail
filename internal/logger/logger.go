package logger

import (
	"io"
	"os"
	"strings"

	"github.com/sirupsen/logrus"
)

var (
	// Log is the global logger instance
	Log        *logrus.Logger
	timeFormat = "2006-01-02 15:04:05"
)

type Level string

const (
	DebugLevel Level = "debug"
	InfoLevel  Level = "info"
	WarnLevel  Level = "warn"
	ErrorLevel Level = "error"
)

type Config struct {
	Level  Level
	Format string
	Output io.Writer
}

// Initialize sets up the logger with the given configuration
func Initialize(cfg Config) {
	Log = logrus.New()

	// set log level
	switch strings.ToLower(string(cfg.Level)) {
	case "debug":
		Log.SetLevel(logrus.DebugLevel)
	case "info":
		Log.SetLevel(logrus.InfoLevel)
	case "warn":
		Log.SetLevel(logrus.WarnLevel)
	case "error":
		Log.SetLevel(logrus.ErrorLevel)
	default:
		Log.SetLevel(logrus.InfoLevel)
	}

	// SET FORMATTER
	switch strings.ToLower(cfg.Format) {
	case "json":
		Log.SetFormatter(&logrus.JSONFormatter{})
	default:
		Log.SetFormatter(&logrus.TextFormatter{
			TimestampFormat: timeFormat,
			FullTimestamp:   true,
			ForceColors:     true,
		})
	}

	// SET OUTPUT
	if cfg.Output != nil {
		Log.SetOutput(cfg.Output)
	} else {
		Log.SetOutput(os.Stdout)
	}
}
