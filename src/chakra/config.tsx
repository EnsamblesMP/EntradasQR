import { defineConfig } from "@chakra-ui/react"

export const themeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Paleta verde
        brand: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14432d" },
          950: { value: "#063012" },
        },
      },
      fonts: {
        heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: {
            value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
          },
          contrast: {
            value: { base: "{colors.white}", _dark: "{colors.gray.900}" },
          },
          fg: {
            value: { base: "{colors.brand.800}", _dark: "{colors.brand.100}" },
          },
          muted: {
            value: { base: "{colors.brand.100}", _dark: "{colors.brand.700}" },
          },
          subtle: {
            value: { base: "{colors.brand.200}", _dark: "{colors.brand.800}" },
          },
          emphasized: {
            value: { base: "{colors.brand.300}", _dark: "{colors.brand.500}" },
          },
          focusRing: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.200}" },
          },
        },
        border: {
          value: { base: "{colors.brand.100}", _dark: "{colors.brand.900}", },
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: "brand",
      borderColor: { base: "brand.600", _dark: "brand.800" },
    },
  },
});
