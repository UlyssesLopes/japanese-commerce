import type { NextConfig } from "next";

// Fotos enviadas pelo backoffice vêm da API (Railway; localhost em desenvolvimento).
const backend = new URL(process.env.BACKEND_URL ?? "http://localhost:8080");
const localBackend = ["localhost", "127.0.0.1"].includes(backend.hostname);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      new URL("/images/**", backend),
      new URL("/uploads/**", backend),
    ],
    dangerouslyAllowLocalIP: localBackend,
  },
  experimental: {
    // Fotos do backoffice (já reduzidas no navegador) passam por Server Action.
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
