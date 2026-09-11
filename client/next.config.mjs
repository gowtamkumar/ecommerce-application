/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "@ant-design/cssinjs",
    "@ant-design/nextjs-registry",
  ],
  experimental: {
    optimizePackageImports: ["react-icons", "recharts"],
  },

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
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
