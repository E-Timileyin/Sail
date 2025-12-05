"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const securityPractices = [
    {
      title: "SSH Keys & Authentication",
      content: [
        "Always use key-based authentication instead of passwords",
        "Secure your private key with proper permissions:",
        "```bash\nchmod 600 ~/.ssh/id_rsa\n```",
        "Never commit SSH keys to your repository"
      ]
    },
    {
      title: "Least Privilege Principle",
      content: [
        "Create a dedicated deployment user (e.g., 'deploy')",
        "Restrict user permissions to only what's necessary",
        "Avoid using root for deployments",
        "Configure proper Docker socket permissions"
      ]
    },
    {
      title: "Network Security",
      content: [
        "Only expose necessary ports (e.g., 80, 443, 22)",
        "Use a firewall to restrict access",
        "Consider using a VPN for private networks",
        "Implement rate limiting where possible"
      ]
    },
    {
      title: "Secrets Management",
      content: [
        "Never hardcode secrets in configuration files",
        "Use environment variables for sensitive data",
        "Consider using a secrets manager for production",
        "Example configuration:\n```yaml\nenvironment:\n  NODE_ENV: \"production\"\n  API_KEY: \"${API_KEY}\"\n```"
      ]
    },
    {
      title: "System Maintenance",
      content: [
        "Keep Docker and system packages updated",
        "Regularly apply security patches",
        "Monitor for vulnerabilities in your containers",
        "Use minimal base images when possible"
      ]
    },
    {
      title: "Upcoming Security Features",
      content: [
        "SSH host key verification",
        "Improved secrets management",
        "Audit logging for deployments",
        "Integration with Vault and other secret managers"
      ]
    }
  ]

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % securityPractices.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + securityPractices.length) % securityPractices.length)
  }

  return (
    <section className="py-24 relative overflow-hidden">
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
            <div className="text-xs uppercase tracking-widest text-white/80">Security</div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Security
            <br />
            <span className="text-white/70">Best Practices</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-2 border-white/20 p-8 md:p-12 bg-white/5 backdrop-blur-sm">
            <div className="absolute top-6 right-8 text-white/10 opacity-60">
              <Quote size={120} />
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[300px] flex flex-col"
                >
                  <h3 className="text-2xl font-bold mb-6 text-white">
                    {securityPractices[activeIndex].title}
                  </h3>
                  <div className="space-y-4 text-white/90">
                    {securityPractices[activeIndex].content.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 mr-3 flex-shrink-0"></div>
                        <div className="text-lg">
                          {item.startsWith('```') ? (
                            <pre className="bg-black/30 p-3 rounded text-sm overflow-x-auto my-2">
                              <code>{item.replace(/```(?:bash\n)?|```/g, '')}</code>
                            </pre>
                          ) : (
                            item
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center">
              <div className="text-white/60 text-sm mr-4">
                {activeIndex + 1} / {securityPractices.length}
              </div>
              <div className="flex-1 h-px bg-white/20 relative">
                <motion.div 
                  className="h-px bg-white absolute top-0 left-0"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${((activeIndex + 1) / securityPractices.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
            </div>
            <div className="flex justify-end mt-8 gap-4">
              <button 
                onClick={prev} 
                className="p-2 border-2 border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300 group"
                aria-label="Previous section"
              >
                <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={next} 
                className="p-2 border-2 border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300 group"
                aria-label="Next section"
              >
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual accent elements */}
      <div className="absolute top-40 right-20 w-56 h-56 border border-white/5"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 border-2 border-white/10"></div>
    </section>
  )
}
