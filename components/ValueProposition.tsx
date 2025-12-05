"use client"

import { motion } from "framer-motion"
import { Zap, Rocket, Shield } from "lucide-react"

export default function ValueProposition() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning-fast Dev Setup",
      description: "Spin up a full environment in minutes — no config hell, no learning curve."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Zero-stress Deployments",
      description: "Ship updates safely with automated builds, logs, and rollback support."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-grade Security",
      description: "Security-first design: encrypted data, hardened API flow, and strict access control."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-neutral-900 to-black">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mb-16 max-w-4xl"
        >
          <div className="flex mb-6">
            <div className="h-px w-12 bg-white/40"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
            Why Choose Sail?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl">
            Lightning-fast dev setup, zero-stress deployments, and enterprise-grade security baked in.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg hover:border-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl -z-10"></div>
    </section>
  )
}
