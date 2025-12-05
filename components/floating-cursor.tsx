"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export default function FloatingCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 }) // Target position (follows mouse instantly)
  const circlePositionRef = useRef({ x: 0, y: 0 }) // Animated position (follows target smoothly)
  const requestRef = useRef<number | null>(null)
  
  // Animation function remains the same
  const animateCursor = useCallback(() => {
    if (!circleRef.current || !dotRef.current || !mounted) return

    // Smooth circle movement towards target position
    circlePositionRef.current.x += (positionRef.current.x - circlePositionRef.current.x) * 0.15
    circlePositionRef.current.y += (positionRef.current.y - circlePositionRef.current.y) * 0.15
    circleRef.current.style.transform = `translate3d(${circlePositionRef.current.x}px, ${circlePositionRef.current.y}px, 0) translate(-50%, -50%) scale(${clicked ? 0.8 : 1})`
    
    // Direct dot movement to target position
    dotRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`
    
    requestRef.current = requestAnimationFrame(animateCursor)
  }, [clicked, mounted]) // Add mounted dependency

  // Reset function - prioritizes event coords, then last known target coords
  const resetCursorPosition = useCallback((e?: MouseEvent) => {
    if (!mounted) return
    
    // Stop any ongoing animation frame
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = null; // Mark as stopped
    }
    
    // Determine position: event coords > last known target > center (initial fallback)
    let x, y;
    if (e) {
      x = e.clientX;
      y = e.clientY;
    } else {
      // Use last known target position if non-zero, otherwise center
      x = positionRef.current.x || window.innerWidth / 2;
      y = positionRef.current.y || window.innerHeight / 2;
    }
    
    // Update target position ref
    positionRef.current = { x, y }
    // Immediately update visual position refs to match target
    circlePositionRef.current = { x, y }
    
    // Apply transform immediately to both elements
    if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    if (circleRef.current) circleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${clicked ? 0.8 : 1})`
    
    // Restart animation loop
    requestRef.current = requestAnimationFrame(animateCursor)
  }, [mounted, animateCursor, clicked]) // Dependencies

  // Main effect for listeners and initialization
  useEffect(() => {
    setMounted(true)
    
    // Initialize positions (only truly needed if no mouse move happens first)
    const initialX = window.innerWidth / 2
    const initialY = window.innerHeight / 2
    if (positionRef.current.x === 0 && positionRef.current.y === 0) {
        positionRef.current = { x: initialX, y: initialY }
    }
    // Ensure visual position starts where target is
    circlePositionRef.current = { x: positionRef.current.x, y: positionRef.current.y }

    if (dotRef.current) dotRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`
    if (circleRef.current) circleRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`

    // Update target position on mouse move
    const updatePosition = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
    }

    // Reset cursor only if visual position is far from click
    const handleMouseDown = (e: MouseEvent) => {
      setClicked(true)
      // Check distance between *animated* circle and actual click
      const dx = circlePositionRef.current.x - e.clientX
      const dy = circlePositionRef.current.y - e.clientY
      if (Math.sqrt(dx * dx + dy * dy) > 30) { // Reset if visual distance > 30px
        resetCursorPosition(e) // Use click event coords for reset
      }
    }
    
    const handleMouseUp = () => setClicked(false)
    const handleMouseEnterLink = () => setLinkHovered(true)
    const handleMouseLeaveLink = () => setLinkHovered(false)

    // Function to ensure animation is running (used on focus/visibility)
    const ensureAnimationRunning = () => {
        // If animation isn't running, restart it from last known position
        if (mounted && !requestRef.current) {
            resetCursorPosition(); // Uses last known positionRef coords
        }
    }

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ensureAnimationRunning()
      } else {
        // Pause animation when hidden
        if (requestRef.current) cancelAnimationFrame(requestRef.current)
        requestRef.current = null // Mark as paused
      }
    }
    // Handle focus gain
    const handleFocus = () => ensureAnimationRunning()
    
    // Reset on mouse entering window (use event coords)
    const handleMouseEnterWindow = (e: MouseEvent) => resetCursorPosition(e)
    
    // Pause animation on mouse leave or blur
    const pauseAnimation = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      requestRef.current = null // Mark as paused
    }

    // Add listeners
    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", pauseAnimation)
    document.documentElement.addEventListener("mouseenter", handleMouseEnterWindow)
    document.documentElement.addEventListener("mouseleave", pauseAnimation)

    const links = document.querySelectorAll("a, button")
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnterLink)
      link.addEventListener("mouseleave", handleMouseLeaveLink)
    })
    
    // Start animation initially
    requestRef.current = requestAnimationFrame(animateCursor)

    // Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", pauseAnimation)
      document.documentElement.removeEventListener("mouseenter", handleMouseEnterWindow)
      document.documentElement.removeEventListener("mouseleave", pauseAnimation)
      
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnterLink)
        link.removeEventListener("mouseleave", handleMouseLeaveLink)
      })
      // Set mounted to false on unmount
      setMounted(false)
    }
  }, [animateCursor, resetCursorPosition]) // Dependencies

  // Effect for updating circle style based on state
  useEffect(() => {
    if (!circleRef.current) return
    
    const size = linkHovered ? '50px' : '30px'
    circleRef.current.style.width = size
    circleRef.current.style.height = size
    circleRef.current.style.border = `1px solid ${clicked ? "rgba(255,255,255,0.5)" : "white"}`
  }, [linkHovered, clicked])

  // Only render on client-side
  if (!mounted) return null

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="cursor-dot fixed pointer-events-none z-[9999]"
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: "white",
          borderRadius: "50%",
          position: "fixed",
          top: 0,
          left: 0,
          transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
          opacity: 1,
        }}
      />
      
      {/* Outer circle */}
      <div
        ref={circleRef}
        className="cursor-circle fixed pointer-events-none z-[9998]"
        style={{
          top: 0,
          left: 0,
          width: "30px",
          height: "30px",
          border: "1px solid white",
          borderRadius: "50%",
          transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
          transition: "width 0.2s ease, height 0.2s ease, border 0.2s ease", // Added transition for smoother size/border changes
        }}
      />
      
      <style jsx global>{`
        body {
          cursor: none;
        }
        
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
          .cursor-dot,
          .cursor-circle {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
