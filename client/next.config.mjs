/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
      {
        protocol: "https",
        hostname: "dev.ecomfixr.com",
      },
    ],
  },
};

export default nextConfig;
