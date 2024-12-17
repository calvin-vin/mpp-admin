/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "mpp.production.pangkalpinangkota.go.id",
        pathname: "/v1/**/**/**",
      },
    ],
  },
};

export default nextConfig;
