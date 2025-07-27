interface LogoFallbackProps {
  className?: string
  width?: number
  height?: number
}

export function LogoFallback({ className = "", width = 120, height = 40 }: LogoFallbackProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold leading-none">+</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Plus Graphics</span>
      </div>
    </div>
  )
}
