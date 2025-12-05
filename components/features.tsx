"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Square, Circle, Triangle, Hexagon } from "lucide-react";

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -25% 0px",
  });

  const features = [
    {
      icon: <Square className="w-6 h-6" />,
      title: "Automated Deployments",
      description: "Deploy your Dockerized apps to any remote server with a single command. Sail handles pulling images, stopping old containers, starting new ones, and applying configurations.",
    },
    {
      icon: <Circle className="w-6 h-6" />,
      title: "Automatic Rollbacks",
      description: "If a deployment fails or a container becomes unhealthy, Sail instantly restores the last working version with zero downtime.",
    },
    {
      icon: <Triangle className="w-6 h-6" />,
      title: "Secure SSH Integration",
      description: "Built-in SSH support with key authentication, multiple server support, and secure connections handled automatically.",
    },
    {
      icon: <Hexagon className="w-6 h-6" />,
      title: "Multi-Environment Support",
      description: "Effortlessly manage development, staging, and production environments with separate configurations.",
    },
    {
      icon: <Square className="w-6 h-6" />,
      title: "Environment Management",
      description: "Define environment variables, secrets, ports, and restart policies in clean, centralized YAML configurations.",
    },
    {
      icon: <Circle className="w-6 h-6" />,
      title: "Docker Image Handling",
      description: "Pull from registries or build directly on server with support for forced rebuilds and CI/CD integration.",
    },
    {
      icon: <Triangle className="w-6 h-6" />,
      title: "Backup System",
      description: "Automatic container and volume backups before deployment, with instant restore capabilities.",
    },
    {
      icon: <Hexagon className="w-6 h-6" />,
      title: "Local Development",
      description: "Test your Docker configurations locally before deploying to remote servers.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.98,
    },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 45,
        damping: 15,
        mass: 0.85,
        duration: 0.7,
        delay: custom * 0.1,
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 50,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-4 mt-20 sm:mt-0 sm:py-24 relative overflow-hidden bg-gradient-to-b from-black to-neutral-900"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
               Features
            </h2>
            <p className="text-lg text-white/70 max-w-2xl">
              Everything you need for seamless Docker deployments
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={itemVariants}
              className="border-2 border-white/20 bg-white/5 backdrop-blur-sm p-8 hover:border-white/50 hover:bg-white/10 transition-all duration-300 group rounded-sm"
            >
              <div className="mb-6 text-white/80 group-hover:text-white transition-colors">
                <div className="bg-white/10 p-3 inline-block rounded-sm group-hover:bg-white/20 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute top-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/3 rounded-full blur-3xl"></div>
    </section>
  );
}
