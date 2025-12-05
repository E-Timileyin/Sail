"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const steps = [
    {
      number: "01",
      title: "Usage / Commands",
      description: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Basic Commands</h4>
            <ul className="space-y-2 text-white/85">
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">sail deploy deployment.yaml</code>
              </li>
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">sail serve deployment.yaml</code>
              </li>
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">sail ssh production</code>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Advanced Options</h4>
            <ul className="space-y-2 text-white/85">
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">--dry-run</code>
                <span className="ml-2 text-white/70">Preview deployment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">--skip-backup</code>
              </li>
              <li className="flex items-start">
                <span className="mr-2">→</span>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">--force-rebuild</code>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Configuration",
      description: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">servers.yaml</h4>
            <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto text-white/85">
                <code>{`- name: production
    host: your-server-ip
    port: 22
    user: deploy
    key_path: ~/.ssh/id_rsa`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">deployment.yaml</h4>
            <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto text-white/85">
              <code>{`image: your-docker-image
tag: latest
containerName: my-app
ports:
  "8080": "80"
environment:
  NODE_ENV: "production"
restartPolicy: "unless-stopped"`}</code>
            </pre>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Troubleshooting",
      description: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Docker not installed</h4>
              <pre className="bg-black/50 p-2 rounded text-xs overflow-x-auto text-white/85">
                <code>sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER</code>
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">SSH Permission Denied</h4>
              <pre className="bg-black/50 p-2 rounded text-xs overflow-x-auto text-white/85">
                <code>chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
ssh -T deploy@your-server-ip</code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      number: "04",
      title: "Security",
      description: (
        <ul className="space-y-2 text-white/85">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use SSH keys instead of passwords</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Create dedicated deployment user with minimal privileges</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Configure firewall to only allow necessary ports</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Keep Docker and system packages updated</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use environment variables for sensitive data</span>
          </li>
        </ul>
      )
    },
    {
      number: "05",
      title: "Roadmap",
      description: (
        <ul className="space-y-2 text-white/85">
          <li className="flex items-start">
            <span className="mr-2">→</span>
            <span>Enhanced health checks</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">→</span>
            <span>Deployment history and rollback</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">→</span>
            <span>Pre/post deployment hooks</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">→</span>
            <span>SSH host verification</span>
          </li>
        </ul>
      )
    },
  ]

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
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
            <div className="text-xs uppercase tracking-widest text-white/80">Documentation</div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            How It Works
            <br />
            <span className="text-white/90">Sail Documentation</span>
          </h2>
        </motion.div>

        <div
          ref={ref}
          className="relative"
        >
          {/* Vertical line with improved visibility */}
          <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-white/30 md:left-1/2"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""} pl-24 md:pl-0`}>
                {/* Increase contrast of step numbers from 10% to 40% */}
                <div className={`text-5xl md:text-7xl font-bold text-white/40 mb-4 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  {step.number}
                </div>
                <h3 className={`text-2xl font-bold mb-2 text-white ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  {step.title}
                </h3>
                {/* Increase contrast of descriptions from 70% to 85% */}
                <p className={`text-white/85 ${index % 2 === 0 ? "md:text-right md:ml-auto" : ""} ${
                  index % 2 === 0 ? "md:max-w-sm md:inline-block" : "max-w-sm"
                }`}>
                  {step.description}
                </p>
              </div>

              <div className="relative flex items-center justify-center z-10 absolute-vertical-center md:static">
                {/* Increase border contrast from 30% to 40% */}
                <div className="w-20 h-20 border-2 border-white/40 flex items-center justify-center bg-[#0a0a0a] group-hover:border-white/60 transition-all duration-300">
                  <div className="text-xl font-bold text-white">{step.number}</div>
                </div>
              </div>

              <div className="flex-1 hidden md:block">
                {/* Increase horizontal line contrast from 20% to 30% */}
                <div className="h-[2px] w-full bg-white/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 right-20 w-32 h-32 border border-white/10"></div>
      <div className="absolute bottom-60 left-20 w-40 h-40 border border-white/5"></div>

      {/* Add custom styles for mobile positioning */}
      <style jsx>{`
        .absolute-vertical-center {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        
        @media (min-width: 768px) {
          .absolute-vertical-center {
            position: static;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
