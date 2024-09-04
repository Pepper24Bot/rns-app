/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rns-metadata.fly.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@xmtp/user-preferences-bindings-wasm"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
