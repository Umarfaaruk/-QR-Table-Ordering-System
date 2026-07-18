/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aurora Noir base — deep space canvas
        ink: '#07070c',
        'ink-2': '#0c0c16',
        'ink-3': '#12121f',
        'ink-4': '#1a1a2e',
        charcoal: '#1a1a2e',
        'charcoal-light': '#16213e',
        // Brand gold (kept, now with a light stop for gradients)
        gold: '#f5a623',
        'gold-light': '#ffcf5c',
        'gold-dark': '#e0951a',
        // Futuristic accents
        violet: '#7c5cff',
        'violet-light': '#a78bfa',
        cyan: '#22d3ee',
        // Kitchen surfaces
        kitchen: '#08080f',
        'kitchen-card': '#12121f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 0 1px rgba(245,166,35,0.25), 0 8px 40px -8px rgba(245,166,35,0.45)',
        'glow-violet': '0 0 0 1px rgba(124,92,255,0.25), 0 8px 40px -8px rgba(124,92,255,0.5)',
        'glow-cyan': '0 0 40px -10px rgba(34,211,238,0.5)',
        glass: '0 8px 32px -8px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'glass-lg': '0 24px 64px -12px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #ffcf5c 0%, #f5a623 55%, #e0951a 100%)',
        'gradient-aurora': 'linear-gradient(120deg, #f5a623 0%, #ff8a4c 30%, #7c5cff 70%, #22d3ee 100%)',
        'gradient-violet': 'linear-gradient(135deg, #a78bfa 0%, #7c5cff 100%)',
        'grid-lines':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(245, 166, 35, 0.9)', boxShadow: '0 0 0 0 rgba(245, 166, 35, 0.35)' },
          '50%': { borderColor: 'rgba(245, 166, 35, 0.45)', boxShadow: '0 0 0 8px rgba(245, 166, 35, 0)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'aurora-shift': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(6%,-8%) scale(1.12)' },
          '66%': { transform: 'translate(-6%,6%) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16,1,0.3,1)',
        'pulse-border': 'pulse-border 1.6s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)',
        float: 'float 7s ease-in-out infinite',
        'aurora-shift': 'aurora-shift 18s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
