/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode catches potential issues
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },

  // Compression and minification
  compress: true,
  productionBrowserSourceMaps: false,

  // TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=120',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
        ],
      },
    ];
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              filename: 'chunks/vendor.js',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              filename: 'chunks/common.js',
            },
          },
        },
      };
    }

    return config;
  },

  // Experimental features (optional)
  experimental: {
    // Optimized package imports
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lodash',
    ],
  },

  // Skip validation during build if needed
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

module.exports = nextConfig;
