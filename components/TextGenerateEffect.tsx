"use client";
import { useEffect, memo, ReactNode } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

// Memoize the component to prevent unnecessary re-renders
export const TextGenerateEffect = memo(function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  speed = 0.2,
  initialDelay = 0, // New param: initial delay before animation starts
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  speed?: number;
  initialDelay?: number; // Initial delay in seconds
}) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ").slice(0, 30); // Limit words to avoid excessive DOM

  useEffect(() => {
    // Add initial delay before starting the animation
    const timer = setTimeout(() => {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration || 1,
          delay: stagger(speed),
        }
      );
    }, initialDelay * 1000); // Convert to milliseconds

    return () => clearTimeout(timer);
  }, [scope.current, animate, duration, filter, speed, initialDelay]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-[var(--white)] text-black opacity-0"
            style={{
              filter: filter ? "blur(10px)" : "none",
              WebkitTextSizeAdjust: "100%",
              fontSize: "inherit",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div
          className="dark:text-[var(--white)] text-black"
          style={{
            WebkitTextSizeAdjust: "100%",
            fontSize: "inherit",
            willChange: "transform",
          }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
});

// New component for content with text generation effect
export const ContentGenerateEffect = memo(function ContentGenerateEffect({
  children,
  className,
  initialDelay = 0,
  speed = 0.5,
  staggerChildren = 0.1,
}: {
  children: ReactNode;
  className?: string;
  initialDelay?: number;
  speed?: number;
  staggerChildren?: number;
}) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(
        ".content-item",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
        {
          duration: speed,
          delay: stagger(staggerChildren),
          type: "spring",
          stiffness: 40,
          damping: 15,
        }
      );
    }, initialDelay * 1000);

    return () => clearTimeout(timer);
  }, [scope.current, animate, speed, staggerChildren, initialDelay]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
});
