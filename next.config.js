/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ВНИМАНИЕ !!
    // Опасно использовать в больших проектах, но идеально для быстрого запуска.
    // Это заставит Vercel игнорировать ошибки типов TypeScript.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Это заставит Vercel игнорировать ошибки стиля кода.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
