import withPWAInit from 'next-pwa';

const isMobileBuild = process.env.NEXT_PUBLIC_BUILD_TARGET === 'capacitor';

/** @type {import('next').NextConfig} */
const nextConfig = isMobileBuild
  ? { output: 'export' }
  : {};

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || isMobileBuild,
  register: true,
  skipWaiting: true,
});

export default isMobileBuild ? nextConfig : withPWA(nextConfig);
