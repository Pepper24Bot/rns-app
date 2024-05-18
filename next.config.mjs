/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rns-metadata.fly.dev",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
