/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    npm_package_version: process.env.npm_package_version,
  },
}

module.exports = {
  ...nextConfig,
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}

