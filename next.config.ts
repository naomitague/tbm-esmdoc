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
    // Tours used to be picked up by the wiki scanner; they now live at /tours.
    const tourRedirects = [
      { source: '/wiki/tour-1-phd-student', destination: '/tours/phd-student', permanent: true },
      { source: '/wiki/tour-2-reviewer', destination: '/tours/reviewer', permanent: true },
      { source: '/wiki/tour-3-modeler', destination: '/tours/modeler', permanent: true },
    ];

    return tourRedirects.concat(['carbon', 'nitrogen'].flatMap(oldSlug => [
      { source: `/models/${oldSlug}`, destination: '/models/vegetation-som', permanent: true },
      { source: `/models/${oldSlug}/:path*`, destination: '/models/vegetation-som/:path*', permanent: true },
    ]));
  },
};

export default nextConfig;
