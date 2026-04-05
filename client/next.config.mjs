/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {},

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
    dangerouslyAllowSVG: true,
    // Allow loading images from localhost and Docker internal IPs
    // This is necessary for development with Docker
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
