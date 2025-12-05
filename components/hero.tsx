"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { TextGenerateEffect } from "./TextGenerateEffect";
import Link from "next/link"; 

export default function Hero() {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shapeRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Create a more pronounced 3D effect for the shape
      const xPos = (clientX / innerWidth - 0.5) * 10;
      const yPos = (clientY / innerHeight - 0.5) * 10;
      const rotateX = -yPos * 0.5; // Rotate based on Y position
      const rotateY = xPos * 0.5; // Rotate based on X position

      shapeRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${
        xPos * 0.3
      }px, ${yPos * 0.3}px, 0)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const shapeAnimationDelay = 0.6;

  return (
    <section className="relative flex items-center px-10 py-[100px] sm:py-[110px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#222_0%,_#000_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-block border border-neutral-800 px-3 py-1 text-xs uppercase tracking-widest text-neutral-400">
                Sail - Docker Deployment Simplified
              </div>
            </motion.div>
            <h1>
              <TextGenerateEffect
                words="AUTOMATED"
                className="text-5xl md:text-7xl lg:text-8xl font-bold m-0 leading-tight tracking-tighter"
                duration={0.5}
                speed={0.2}
                initialDelay={0.2}
              />
              <TextGenerateEffect
                words="DOCKER"
                className="text-5xl md:text-7xl lg:text-8xl font-bold m-0 leading-tight tracking-tighter text-neutral-400"
                duration={0.5}
                speed={0.2}
                initialDelay={0.4}
              />
              <TextGenerateEffect
                words="DEPLOYMENT"
                className="text-5xl md:text-7xl lg:text-8xl font-bold m-2 leading-tight tracking-tighter"
                duration={0.5}
                speed={0.2}
                initialDelay={0.6}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-neutral-400 mb-8 max-w-md text-lg"
            >
              Deploy Dockerized apps to any server with one command. Fast. Secure. Zero CI/CD overhead.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Link
                href="https://github.com/E-Timileyin/Sail"
                className="px-8 py-3 bg-transparent border border-white/70 text-white rounded-md font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-white/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/E-Timileyin/Sail"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-white/70 text-white rounded-md font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2 group"
              >
                <FaGithub className="w-5 h-5" />
                View on GitHub
              </a>
            </motion.div>
          </div>
          {/* shape with professional animation sequence */}
          <div className="relative">
            <motion.div
              ref={shapeRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: shapeAnimationDelay,
                ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth appearance
              }}
              className="relative transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Background shape - appears first */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-neutral-950 z-[-1] rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: shapeAnimationDelay,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ transform: "translateZ(-20px)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
              </motion.div>

              {/* Main image container */}
              <motion.div
                className="aspect-square relative overflow-hidden rounded-lg"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.9,
                  delay: shapeAnimationDelay + 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <img
                  src="/shipping.png"
                  alt="Shipping"
                  className="w-full h-full object-cover invert"
                />
                {/* Overlay gradient */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" /> */}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center gap-8 border border-neutral-800 px-8 py-4">
            <div className="text-xs uppercase tracking-widest text-neutral-400">
              Scroll
            </div>
            <div className="h-px w-10 bg-neutral-800"></div>
            <div className="text-xs uppercase tracking-widest text-neutral-400">
              Learn More
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
