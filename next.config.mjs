/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "xzy5oofpng.ufs.sh",
                port: "",
                pathname: "/*",
            },
            {
                protocol: 'https',
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/*/*",
            },
            {
                protocol: 'https',
                hostname: "www.google.com",
                pathname: "/s2/favicons/**",
            },
            {
                protocol: 'https',
                hostname: "api.qrserver.com",
            }
        ],

    }
};

export default nextConfig;