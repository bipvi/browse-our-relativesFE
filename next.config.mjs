/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // oppure specifica i domini delle immagini del tuo backend
      },
    ],
  },
}

export default nextConfig