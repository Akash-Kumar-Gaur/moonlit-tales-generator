import { useLanguage } from "./i18n";
import type { Language } from "./language";

export type ThemeFonts = {
  serif: string;
  serifItalic: string;
  serifSemi: string;
  serifSemiItalic: string;
  sans: string;
  sansMedium: string;
  sansSemi: string;
};

const EN: ThemeFonts = {
  serif: "CormorantGaramond_500Medium",
  serifItalic: "CormorantGaramond_500Medium_Italic",
  serifSemi: "CormorantGaramond_600SemiBold",
  serifSemiItalic: "CormorantGaramond_600SemiBold_Italic",
  sans: "Lora_400Regular",
  sansMedium: "Lora_500Medium",
  sansSemi: "Lora_600SemiBold",
};

const HI: ThemeFonts = {
  serif: "TiroDevanagariHindi_400Regular",
  serifItalic: "TiroDevanagariHindi_400Regular_Italic",
  serifSemi: "TiroDevanagariHindi_400Regular",
  serifSemiItalic: "TiroDevanagariHindi_400Regular_Italic",
  sans: "Hind_400Regular",
  sansMedium: "Hind_500Medium",
  sansSemi: "Hind_600SemiBold",
};

export function fontsForLanguage(lang: Language): ThemeFonts {
  return lang === "hi" ? HI : EN;
}

/** Returns font family names for the active UI language. */
export function useThemeFont(): ThemeFonts {
  const { language } = useLanguage();
  return fontsForLanguage(language);
}

/**
 * Fonts for story body content — uses the story's own language when known,
 * otherwise falls back to the UI language.
 */
export function useContentFont(contentLanguage?: Language): ThemeFonts {
  const { language } = useLanguage();
  return fontsForLanguage(contentLanguage ?? language);
}
