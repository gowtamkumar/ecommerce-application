import type { MetadataRoute } from 'next';

/**
 * PWA Manifest Configuration
 * Provides app metadata for Progressive Web App features
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ecommerce - Premium E-commerce Platform',
    short_name: 'ecommerce',
    description: 'Premium e-commerce platform for quality products',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff6600',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'e-commerce'],
    lang: 'en-US',
    dir: 'ltr',
  };
}
