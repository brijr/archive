import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://du5pekqoht3fwi0h.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
