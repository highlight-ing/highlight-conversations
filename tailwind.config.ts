import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './app/not-found.tsx',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        green: {
          DEFAULT: 'rgb(76, 237, 160)',
          // Opacity variations
          'opacity-100': 'rgba(76, 237, 160, 1.0)',
          'opacity-90': 'rgba(76, 237, 160, 0.9)',
          'opacity-80': 'rgba(76, 237, 160, 0.8)',
          'opacity-70': 'rgba(76, 237, 160, 0.7)',
          'opacity-60': 'rgba(76, 237, 160, 0.6)',
          'opacity-50': 'rgba(76, 237, 160, 0.5)',
          'opacity-40': 'rgba(76, 237, 160, 0.4)',
          'opacity-30': 'rgba(76, 237, 160, 0.3)',
          'opacity-20': 'rgba(76, 237, 160, 0.2)',
          'opacity-10': 'rgba(76, 237, 160, 0.1)',
          // Darker shades
          100: 'rgb(76, 237, 160)',
          90: 'rgb(68, 213, 144)',
          80: 'rgb(61, 190, 128)',
          70: 'rgb(53, 166, 112)',
          60: 'rgb(46, 142, 96)',
          50: 'rgb(38, 119, 80)',
          40: 'rgb(30, 95, 64)',
          30: 'rgb(23, 71, 48)',
          20: 'rgb(15, 47, 32)',
          10: 'rgb(8, 24, 16)',
        },
        white: 'rgba(255, 255, 255, 1.0)',
        'current-preview': 'rgba(102, 141, 122, 1.0)',
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      backgroundColor: {
        primary: 'rgba(15, 15, 15, 1.0)',
        secondary: 'rgba(34, 34, 34, 1.0)',
        tertiary: 'rgba(25, 25, 25, 1.0)',
        subtle: 'rgba(43, 43, 43, 1.0)',
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
        primary: 'rgba(34, 34, 34, 1)',
        secondary: 'rgba(68, 68, 68, 1)',
        tertiary: 'rgba(34, 34, 34, 1)',
        light: 'rgba(255, 255, 255, 1.0)',
        green: 'rgba(76, 237, 160, 1.0)',
      },
      textColor: {
        primary: 'rgba(238, 238, 238, 1)',
        secondary: 'rgba(180, 180, 180, 1)',
        tertiary: 'rgba(135, 135, 135, 1.0)',
        subtle: 'rgba(72, 72, 72, 1.0)',
        black: '#0F0F0F',
      },
      searchBar: {
        DEFAULT: 'hsl(var(--searchbar-bg))',
        active: 'hsl(var(--searchbar-bg-active))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.2s ease-in',
        fadeOut: 'fadeOut 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config