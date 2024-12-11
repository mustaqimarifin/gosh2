import { withContentlayer } from 'next-contentlayer2'
//import withPlaiceholder from '@plaiceholder/next'

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@trpc/server'],
  //experimental: { serverComponentsExternalPackages: ['@trpc/server'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'beebom.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'emojis.slackmojis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.punkapi.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // This is only intended to pass CI and should be skiped in your app
    if (config.name === 'server') config.optimization.concatenateModules = false
    return config
  },
}

export default withContentlayer(nextConfig)
