/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nonaktifkan pemeriksaan tipe selama build
  typescript: {
    ignoreBuildErrors: true,
  },
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
  // Batasi ukuran bundle
  productionBrowserSourceMaps: false,

  // Nonaktifkan fitur tertentu jika bermasalah
  swcMinify: true,
  optimizeFonts: false,
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
