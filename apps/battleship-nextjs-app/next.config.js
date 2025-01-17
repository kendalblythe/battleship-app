/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['battleship-engine', 'battleship-ui'],
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
