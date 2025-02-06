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
        ]
    }
};

export default nextConfig;