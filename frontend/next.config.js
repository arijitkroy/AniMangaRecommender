/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE || 'http://127.0.0.1:5000/api'}/:path*`
      }
    ]
  }
}
module.exports = nextConfig
