/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.sofascore.com'],
    unoptimized: true, // Dış kaynak için optimize edilmemiş resimler
  },
};

module.exports = nextConfig; 