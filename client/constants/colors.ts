/**
 * Global Design System Colors
 * Centralized color definitions for consistent theming across the application
 */

export const footerColors = {
  // Background colors
  bg: {
    primary: '#0f172a',    // slate-900
    secondary: '#1e293b',  // slate-800
    accent: '#334155',     // slate-700
  },
  
  // Text colors
  text: {
    primary: '#f9fafb',    // gray-50
    secondary: '#d1d5db',  // gray-300
    muted: '#9ca3af',      // gray-400
    subtle: '#6b7280',     // gray-500
  },
  
  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    heavy: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Accent colors
  accent: {
    blue: '#3b82f6',       // blue-500
    purple: '#a855f7',     // purple-500
    green: '#22c55e',      // green-500
    orange: '#f97316',     // orange-500
    pink: '#ec4899',       // pink-500
  },
  
  // Glassmorphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.15)',
  },
};

export const socialColors = {
  facebook: '#1877f2',
  twitter: '#000000',
  instagram: {
    start: '#f58529',
    middle: '#dd2a7b',
    end: '#8134af',
    gradient: 'linear-gradient(to bottom right, #f58529, #dd2a7b, #8134af)',
  },
  linkedin: '#0a66c2',
  youtube: '#ff0000',
  whatsapp: '#25d366',
};

export const globalColors = {
  primary: '#F7AA0E',
  secondary: '#000000',
  accent: '#F2F2F2',
};

// Design tokens
export const designTokens = {
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  shadows: {
    glowBlue: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.3)',
    glowWhite: '0 0 15px rgba(255, 255, 255, 0.3)',
  },
};

// Feature gradients for FooterTop cards
export const featureGradients = {
  delivery: {
    from: 'from-blue-500/20',
    to: 'to-cyan-500/20',
  },
  support: {
    from: 'from-purple-500/20',
    to: 'to-pink-500/20',
  },
  payment: {
    from: 'from-green-500/20',
    to: 'to-emerald-500/20',
  },
  gift: {
    from: 'from-orange-500/20',
    to: 'to-red-500/20',
  },
};

// All colors in one object for easy access
export const colors = {
  footer: footerColors,
  social: socialColors,
  global: globalColors,
};

export default colors;
