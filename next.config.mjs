/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Penting untuk Docker
  reactStrictMode: true,
  swcMinify: true,

  // Konfigurasi tambahan jika diperlukan
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
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
