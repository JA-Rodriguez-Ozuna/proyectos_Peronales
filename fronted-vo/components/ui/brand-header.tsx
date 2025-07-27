import { Logo } from "@/components/ui/logo"

interface BrandHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

export function BrandHeader({ title, subtitle, className = "" }: BrandHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center mb-6">
        <Logo width={250} height={80} />
      </div>
      {title && <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>}
      {subtitle && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  )
}
