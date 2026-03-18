/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exponemos BACKEND_URL también al cliente sin usar el prefijo NEXT_PUBLIC_
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
}

export default nextConfig
