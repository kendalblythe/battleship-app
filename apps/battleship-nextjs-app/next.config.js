/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['battleship-engine', 'battleship-ui'],
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
  webpack: (config) => {
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
};

export default nextConfig;
