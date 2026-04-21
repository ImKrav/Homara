import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",         // lo que llamas desde el frontend
        destination: `${process.env.BACKEND_INTERNAL_URL}/:path*`, 
      },
    ];
  },
};

export default nextConfig;