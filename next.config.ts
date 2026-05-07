import type { NextConfig } from "next";

/** Allow either `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`. */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || "";

const nextConfig: NextConfig = {
  env: {
    ...(supabaseUrl ? { NEXT_PUBLIC_SUPABASE_URL: supabaseUrl } : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crafatar.com",
      },
    ],
  },
};

export default nextConfig;
