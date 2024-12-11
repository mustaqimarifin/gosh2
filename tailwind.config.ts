import { fontFamily } from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'
import type { Config } from 'tailwindcss'

export default {
  //important: true,
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      transitionProperty: {
        backgroundColor: 'backgroundColor',
      },
      height: {
        'screen-35': '35vh',
      },
      minHeight: {
        14: '3.5rem',
        36: '9rem',
      },
      minWidth: {
        sm: '24rem',
        sidebar: '28rem',
        '1/5': '20%',
      },
      maxWidth: {
        '60-ch': '60ch',
        '1/4': '25%',
      },
      translate: {
        'screen-1/4': '25%',
      },
      transitionDuration: {
        325: '325ms',
      },

      fontSize: {
        xxs: '.625rem',
      },
      spacing: {
        '2px': '2px',
      },
      strokeWidth: {
        1.5: '1.5',
        2.5: '2.5',
      },
      zIndex: {
        '-1': '-1',
      },
      lineClamp: {
        10: 10,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography, animate],
} satisfies Config
