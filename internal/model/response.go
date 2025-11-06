package model

import "time"

type Response struct {
	Command string `json:"command,omitempty"` // For debugging/logs
	Status  bool   `json:"status"`            // Success/failure flag
	Message string `json:"message,omitempty"` // Readable summary
	Output  string `json:"output,omitempty"`  // Raw terminal output

	StatusCode int       `json:"status-code"`
	Error      string    `json:"error,omitempty"` // Raw error (stderr)
	Time       time.Time `json:"time"`
}
