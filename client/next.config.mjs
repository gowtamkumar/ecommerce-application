/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'http://localhost:3000/**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
