import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @param {string} phase @returns {import('next').NextConfig} */
export default function nextConfig(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER && process.env.PORTFOLIO_DEV_LOCK !== '1') {
    throw new Error('Inicie o desenvolvimento com npm run dev para proteger .next-dev contra servidores simultâneos.');
  }
  // Production builds must not overwrite the assets of a running dev server.
  return { distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next' };
}
