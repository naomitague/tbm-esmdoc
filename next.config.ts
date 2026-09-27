import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  typescript: {
    ignoreBuildErrors: false,
  },
  // carbon + nitrogen were merged into the Dynamic Vegetation and SOM model; keep old links working.
  // (/models/biogeochemistry is deliberately NOT redirected — it's reserved for a future
  // biogeochemistry / soil-development model suite.)
  async redirects() {
    return ['carbon', 'nitrogen'].flatMap(oldSlug => [
      { source: `/models/${oldSlug}`, destination: '/models/vegetation-som', permanent: true },
      { source: `/models/${oldSlug}/:path*`, destination: '/models/vegetation-som/:path*', permanent: true },
    ]);
  },
};

export default nextConfig;
