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
    ],
  },
};
module.exports = nextConfig;
