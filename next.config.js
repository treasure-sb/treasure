const MillionLint = require("@million/lint");
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qkdlfshzugzeqlznyqfv.supabase.co",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.13",
        port: "54321",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:create*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
