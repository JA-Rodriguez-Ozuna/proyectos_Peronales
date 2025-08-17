/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuracion basica para Vercel
  reactStrictMode: true,
  swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://plus-graphics.onrender.com',
  },
  
  // Solo proxy en desarrollo
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
        },
      ];
    }
    return [];
  }
}

export default nextConfig
