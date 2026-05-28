"use client"

import React, { useEffect, useRef } from "react"

export function CinematicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      baseOpacity: number
      wobbleSpeed: number
      wobbleDistance: number
      wobbleOffset: number
      color: string
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 22000))

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2.5 + 0.8
        const baseOpacity = Math.random() * 0.3 + 0.1
        // Mix brand orange embers with soft white glowing dust
        const isOrange = Math.random() > 0.4
        const color = isOrange ? "255, 69, 0" : "255, 255, 255"

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.15,
          opacity: baseOpacity,
          baseOpacity,
          wobbleSpeed: Math.random() * 0.008 + 0.002,
          wobbleDistance: Math.random() * 25 + 5,
          wobbleOffset: Math.random() * Math.PI * 2,
          color,
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach((p) => {
        // Move particle upward
        p.y += p.speedY
        p.wobbleOffset += p.wobbleSpeed

        // Soft lateral swaying
        const wobbleX = Math.sin(p.wobbleOffset) * p.speedX * 2
        p.x += p.speedX + wobbleX

        // Mouse reaction: gentle pushing effect away from the mouse cursor
        if (mx > -500 && my > -500) {
          const dx = p.x - mx
          const dy = p.y - my
          const distance = Math.hypot(dx, dy)
          if (distance < 200) {
            const force = (200 - distance) / 200
            p.x += (dx / distance) * force * 1.5
            p.y += (dy / distance) * force * 1.5
          }
        }

        // Wrap particles around borders
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        // Render soft glow particle
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `rgba(${p.color}, ${p.opacity})`)
        gradient.addColorStop(0.4, `rgba(${p.color}, ${p.opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(${p.color}, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(updateAndDraw)
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    resizeCanvas()
    updateAndDraw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      aria-hidden="true"
    />
  )
}
