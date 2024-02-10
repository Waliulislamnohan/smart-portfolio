/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  source: '/api/:path*',
        destination: 'http://localhost:3000/api/proxy/:path*', 
};

export default nextConfig;
