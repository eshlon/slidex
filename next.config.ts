import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // ----------------------------------------------------------------------------
  // Serve the app under /slidex
  // basePath: '/slidex',
  // assetPrefix: '/slidex/',
  // ----------------------------------------------------------------------------

  output: 'standalone',

  serverExternalPackages: ['pg', 'bcrypt'],

  // Ensure HTTPS is detected correctly behind reverse proxy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Forwarded-Proto',
            value: 'https'
          }
        ]
      }
    ];
  },

  // Optional: force one format to avoid redirect loops
  // trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
