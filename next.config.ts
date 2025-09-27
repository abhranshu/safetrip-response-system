import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Remove development-only configurations for production
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js')]
        }
      }
    }
  })
};

export default nextConfig;
