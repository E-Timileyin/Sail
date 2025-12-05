
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add image optimization configuration
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Update experimental settings to disable scroll restoration
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'motion',
      'framer-motion',
      '@tabler/icons-react'
    ],
    // Disable scroll restoration to prevent auto-scrolling on refresh
    scrollRestoration: false,
  },
  // Add compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

module.exports = nextConfig;