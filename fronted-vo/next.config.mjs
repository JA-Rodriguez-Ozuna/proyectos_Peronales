/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Configuracion para produccion full-stack
  output: 'standalone',
  
  // Proxy para APIs - conectar con Flask backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ]
  },
  
  // Variables de entorno publicas
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  }
}

export default nextConfig
