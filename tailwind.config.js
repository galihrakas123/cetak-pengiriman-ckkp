/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        header: "var(--header)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          hover: "var(--destructive-hover)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // M3 Design Tokens from reference
        canvas: {
          DEFAULT: "#F0F2F5",
          dark: "#121212",
        },
        "on-primary": "#FFFFFF",
        "primary-container": "#E1F0E8",
        "on-primary-container": "#06683D",
        "secondary-container": "#E3F2FD",
        "on-secondary-container": "#1976D2",
        "error-container": "#FFEBEE",
        "on-error-container": "#991B1B",
        "on-error": "#FFFFFF",
        outline: {
          DEFAULT: "#9E9E9E",
          variant: "#E2E4E8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dim: "#E0E0E0",
          bright: "#FFFFFF",
          container: {
            DEFAULT: "#F8F9FA",
            low: "#F8F9FA",
            lowest: "#FFFFFF",
            high: "#EAEAEA",
            highest: "#E0E0E0",
          },
        },
        tertiary: {
          DEFAULT: "#EEEEEE",
          container: "#FFF8E1",
          "on-container": "#B45309",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  important: true,
  plugins: [],
};
