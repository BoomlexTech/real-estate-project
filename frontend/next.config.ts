import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/sample1', destination: '/v4-noir-opulence.html' },
      { source: '/sample2', destination: '/v3-brutalist-gold.html' },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.awtadrealestate.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
