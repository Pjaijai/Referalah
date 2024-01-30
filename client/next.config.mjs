/** @type {import('next').NextConfig} */

import withPWA from "next-pwa"

const prod = process.env.NODE_ENV === "production"

const pwaWrapper = withPWA({
  dest: "public",
  // default disable pwa in dev mode
  disable: !prod,
  register: true,
  skipWaiting: true,
})
export default pwaWrapper({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  experimental: { severActions: true },
  images: {
    domains: ["localhost"], // Add the domain where your images are hosted
  },
})
