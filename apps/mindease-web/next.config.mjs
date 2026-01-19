import process from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mindease/design-system"],
  output: 'standalone',
  rewrites: async () => [
    {
      source: `/auth/:path+`,
      destination: `${process.env.MINDEASE_WEB_AUTH_DOMAIN}/:path+`,
    },
    {
      source: `/api/auth`,
      destination: `${process.env.MINDEASE_WEB_AUTH_DOMAIN}/api/auth`,
    },
    {
      source: `/api/auth/:path+`,
      destination: `${process.env.MINDEASE_WEB_AUTH_DOMAIN}/api/auth/:path+`,
    },
    {
      source: `/mindease-web-auth-static/:path+`,
      destination: `${process.env.MINDEASE_WEB_AUTH_DOMAIN}/mindease-web-auth-static/:path+`,
    },
  ],
};

export default nextConfig;
