/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/arc-flash-study-analysis",
        destination: "/ae/services/study-analysis/arc-flash-study",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
