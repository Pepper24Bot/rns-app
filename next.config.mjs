/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
