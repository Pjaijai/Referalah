import withPWA from "next-pwa"

const prod = process.env.NODE_ENV === "production"

const pwaConfig = {
  dest: "public",
  disable: !prod,
  register: true,
  skipWaiting: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
    scrollRestoration: true,
  },
  images: {
    domains: ["localhost"],
  },
}

export default withPWA(pwaConfig)(nextConfig)
