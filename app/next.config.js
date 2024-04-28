/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", //  static exports for best speed
  images: {
    unoptimized: true,
    domains: [""],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
