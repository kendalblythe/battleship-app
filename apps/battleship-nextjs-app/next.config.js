
import nextTranspileModules from "next-transpile-modules";

const withTM = nextTranspileModules(['battleship-engine', 'battleship-ui']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withTM(nextConfig);
