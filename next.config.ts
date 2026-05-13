import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure nodemailer is treated as external on server
      config.externals = [...(config.externals || []), 'nodemailer'];
    }
    return config;
  },
};

export default nextConfig;
