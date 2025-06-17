/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    // Enable JSON imports
    experimental: {
        esmExternals: true,
    },
};

module.exports = nextConfig; 