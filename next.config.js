/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',   // Required for Docker multi-stage build
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.authentication.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

module.exports = nextConfig