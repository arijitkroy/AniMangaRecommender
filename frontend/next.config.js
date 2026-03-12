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
  },
  images: {
    domains: ['w3.org', 'www.w3.org'],
  }
}
module.exports = nextConfig
