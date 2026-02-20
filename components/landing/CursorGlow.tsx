'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.background = `radial-gradient(700px at ${e.clientX}px ${e.clientY}px, rgba(139, 92, 246, 0.06), transparent 80%)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <div ref={glowRef} id="cursor-glow" />
}
