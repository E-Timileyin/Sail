"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function Work() {
  const [activeTab, setActiveTab] = useState('install')

  const installationSteps = [
    {
      id: 'install',
      title: 'Installation',
      content: (
        <div className="space-y-6">
          <p className="text-white/80 leading-relaxed">
            Sail makes deploying Dockerized applications simple. You can get started in just a few steps.
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
            <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
            <p className="text-white/80 mb-4">Before installing Sail, make sure you have:</p>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Go 1.16+ installed on your local machine</li>
              <li>Docker and Docker Compose installed on your target server(s)</li>
              <li>SSH access to your servers</li>
              <li>A Dockerized application with a docker-compose.yml file</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'cli',
      title: 'CLI Installation',
      content: (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
            <h3 className="text-xl font-bold text-white mb-4">Option 1: Install as CLI Tool (Recommended)</h3>
            <p className="text-white/80 mb-4">The easiest way to get Sail running is by installing it directly from GitHub:</p>
            <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm text-gray-300 mb-4">
              <code># Install the latest version
go install github.com/E-Timileyin/sail@latest

# Verify the installation
sail --version</code>
            </pre>
            <p className="text-white/80">
              This downloads the source, compiles it, and places the sail binary in your Go bin directory ($GOPATH/bin).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'source',
      title: 'Build From Source',
      content: (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
            <h3 className="text-xl font-bold text-white mb-4">Option 2: Build From Source</h3>
            <p className="text-white/80 mb-4">If you prefer to compile Sail yourself:</p>
            <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm text-gray-300 mb-4">
              <code># Clone the repository
git clone https://github.com/E-Timileyin/Sail.git
cd Sail

# Build the binary
go build -o sail .

# Run the executable
./sail --help

# (Optional) Move it to your PATH
sudo mv sail /usr/local/bin/</code>
            </pre>
            <p className="text-white/80">
              This approach is useful if you want to customize Sail or contribute to the project.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'deploy',
      title: 'Quick Start',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Quick Start: Deploy Your First App</h3>
          <p className="text-white/80">Once installed, you can deploy in three simple steps:</p>
          
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
              <h4 className="text-xl font-bold text-white mb-4">1. Configure Servers</h4>
              <p className="text-white/80 mb-4">Create a <code className="bg-black/50 px-1.5 py-0.5 rounded">servers.yaml</code> file defining your remote servers:</p>
              <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
                <code>{`- name: production
  host: your-server-ip
  port: 22
  user: deploy
  key_path: ~/.ssh/id_rsa`}</code>
              </pre>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
              <h4 className="text-xl font-bold text-white mb-4">2. Configure Deployment</h4>
              <p className="text-white/80 mb-4">Create a <code className="bg-black/50 px-1.5 py-0.5 rounded">deployment.yaml</code> for your application settings:</p>
              <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
                <code>{`image: your-docker-image
tag: latest
containerName: my-app-container
ports:
  "8080": "80"
environment:
  NODE_ENV: "production"
  API_KEY: "your-secret-key"
restartPolicy: "unless-stopped"`}
                </code>
              </pre>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/50">
              <h4 className="text-xl font-bold text-white mb-4">3. Deploy</h4>
              <p className="text-white/80 mb-4">Run Sail to deploy your app:</p>
              <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm text-gray-300 mb-4">
                <code>{`# Deploy to the server
sail deploy deployment.yaml

# Start locally for testing
sail serve deployment.yaml

# SSH into your server
sail ssh production`}
                </code>
              </pre>
              <div className="mt-4">
                <p className="text-white/80 mb-2">Optional flags for advanced workflows:</p>
                <ul className="list-disc pl-5 space-y-1 text-white/80 text-sm">
                  <li><code className="bg-black/50 px-1 py-0.5 rounded">--dry-run</code> → Preview deployment without executing</li>
                  <li><code className="bg-black/50 px-1 py-0.5 rounded">--skip-backup</code> → Skip backup of existing containers</li>
                  <li><code className="bg-black/50 px-1 py-0.5 rounded">--force-rebuild</code> → Rebuild the Docker image from scratch</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-transparent backdrop-blur-lg border border-white/40 p-4 mt-8">
            <h4 className="text-lg font-bold text-white mb-2">Tip for Developers</h4>
            <ul className="list-disc pl-5 space-y-1 text-white/80">
              <li>Keep separate <code className="bg-black/50 px-1 py-0.5 rounded">servers.yaml</code> for different environments (dev, staging, production)</li>
              <li>Use environment variables for sensitive data instead of hardcoding secrets in YAML</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-white/40"></div>
            <div className="text-xs uppercase tracking-widest text-white/80">Get Started</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            {/* <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 md:mb-0 text-white">
              Sail
              <br />
              <span className="text-white/70">Documentation</span>
            </h2> */}
            <a 
              href="https://github.com/E-Timileyin/sail" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-white/20 px-6 py-3 text-sm uppercase tracking-widest text-white/80 hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center group"
            >
              View on GitHub
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {installationSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === step.id
                    ? 'bg-white/10 text-white border-t-2 border-white'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[400px]">
            {installationSteps.find(step => step.id === activeTab)?.content}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 right-0 w-32 h-32 border border-white/10"></div>
      <div className="absolute bottom-20 left-0 w-48 h-48 border border-white/5"></div>
    </section>
  )
}
