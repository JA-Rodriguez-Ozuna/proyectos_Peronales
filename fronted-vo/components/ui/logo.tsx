"use client"

import { useState } from "react"
import Image from "next/image"
import { LogoFallback } from "./logo-fallback"

interface LogoProps {
  className?: string
  width?: number
  height?: number
  variant?: "full" | "icon" // Nueva prop para elegir entre logo completo o solo icono
}

export function Logo({ className = "", width = 120, height = 40, variant = "full" }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return <LogoFallback className={className} width={width} height={height} />
  }

  const imageSrc = variant === "full" ? "/images/plus-graphics-logo-full.jpeg" : "/images/plus-graphics-icon.png"

  const altText = variant === "full" ? "Plus Graphics" : "Plus Graphics Icon"

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={altText}
        width={width}
        height={height}
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}
