/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["rns-metadata.fly.dev", "i.ibb.co"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
