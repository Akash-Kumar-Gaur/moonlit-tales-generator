/**
 * Extensible language codes (ISO 639-1). Add ta, bn, etc. later.
 */
export type Language = "en" | "hi";

export const SUPPORTED_LANGUAGES: Language[] = ["en", "hi"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
};

/** Prompt-facing language names for story generation. */
export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  en: "English",
  hi: "Hindi",
};

export const LANGUAGE_STORAGE_KEY = "moonlit_language";

export function isLanguage(value: unknown): value is Language {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as string[]).includes(value)
  );
}

export function languageDisplayName(lang: Language): string {
  return LANGUAGE_DISPLAY_NAMES[lang] ?? lang;
}

/**
 * Instruction appended to the story-generation system prompt.
 * JSON output shape stays identical; only content language changes.
 */
export function storyLanguageInstruction(lang: Language): string {
  const languageName = languageDisplayName(lang);
  return `Write the entire story in ${languageName}. Use natural, warm, everyday ${languageName} appropriate for reading aloud to a child — not overly formal or literary vocabulary. The title should also be in ${languageName}.`;
}

/** Preferred TTS locale, with optional fallback for English. */
export function ttsLocales(lang: Language): { primary: string; fallback?: string } {
  switch (lang) {
    case "hi":
      return { primary: "hi-IN" };
    case "en":
    default:
      return { primary: "en-IN", fallback: "en-US" };
  }
}
