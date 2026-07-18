/**
 * Moonlit Tales design tokens — exact conversions from the web CSS hsl() values.
 * Source: src/styles.css :root
 */
export const colors = {
  // Night (create screen)
  night: "#0D0F16", // hsl(230 25% 7%)
  nightCard: "#171926", // hsl(230 25% 12%)
  candle: "#F6BB55", // hsl(38 90% 65%)
  candleSoft: "rgba(246, 187, 85, 0.15)", // hsl(38 90% 65% / 0.15)
  candleSoft10: "rgba(246, 187, 85, 0.10)", // chip selected bg (web: bg-candle/10)
  candleGlow14: "rgba(246, 187, 85, 0.14)", // ambient top glow
  candle80: "rgba(246, 187, 85, 0.80)",
  candle70: "rgba(246, 187, 85, 0.70)",
  candle60: "rgba(246, 187, 85, 0.60)",
  candleShadow: "rgba(246, 187, 85, 0.35)",

  // Paper (reading screen)
  paper: "#F4F1EB", // hsl(36 30% 94%)
  paperSoft: "#EDE7DE", // hsl(36 30% 90%)
  paperRadial: "#EDE3D4", // hsl(36 40% 88%)
  ink: "#1F212E", // hsl(230 20% 15%)
  inkSoft: "rgba(31, 33, 46, 0.6)", // hsl(230 20% 15% / 0.6)
  ink90: "rgba(31, 33, 46, 0.9)",
  ink50: "rgba(31, 33, 46, 0.5)",
  ink40: "rgba(31, 33, 46, 0.4)",
  ink25: "rgba(31, 33, 46, 0.25)",
  ink20: "rgba(31, 33, 46, 0.2)",
  ink10: "rgba(31, 33, 46, 0.1)",
  ink08: "rgba(31, 33, 46, 0.08)",
  ink04: "rgba(31, 33, 46, 0.04)",

  // Semantic (night surface defaults)
  foreground: "#E7E2DA", // hsl(36 20% 88%)
  mutedForeground: "#A39B8F", // hsl(36 10% 60%)
  mutedForeground50: "rgba(163, 155, 143, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  input: "rgba(255, 255, 255, 0.06)",
  white04: "rgba(255, 255, 255, 0.04)",

  // Star dots use paper at low opacity
  star: "rgba(244, 241, 235, 0.6)",

  // Recent card glow accents (idx-based, matching web)
  glowCandle: "#F6BB55", // hsl(38 90% 65%)
  glowBlue: "#85B3E0", // hsl(210 60% 70%)
  glowGreen: "#8BC19D", // hsl(140 30% 65%)
} as const;

/** @deprecated Prefer useThemeFont() — English-only static map kept for non-UI assets. */
export const fonts = {
  serif: "CormorantGaramond_500Medium",
  serifItalic: "CormorantGaramond_500Medium_Italic",
  serifSemi: "CormorantGaramond_600SemiBold",
  serifSemiItalic: "CormorantGaramond_600SemiBold_Italic",
  sans: "Lora_400Regular",
  sansMedium: "Lora_500Medium",
  sansSemi: "Lora_600SemiBold",
} as const;
