/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
      {
        source: '/suggestions.hbs',
        destination: '/api/suggestions',
      },
    ],
  };

export default nextConfig;