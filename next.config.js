/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.sofascore.com',
        port: '',
        pathname: '/api/v1/player/*/image', // Daha spesifik path
      }
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    // Bu satırları kaldırın - problem çıkarabilir:
    // contentDispositionType: 'attachment',
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;