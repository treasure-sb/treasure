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
    ],
  },
};
module.exports = nextConfig;
