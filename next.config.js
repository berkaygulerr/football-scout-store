/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.sofascore.com'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig; 