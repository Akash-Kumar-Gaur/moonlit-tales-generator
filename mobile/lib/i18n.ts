import { useCallback } from "react";
import { useStoryStore } from "./store";
import { t, type TranslationKey, translations } from "./translations";
import type { Language } from "./language";

export function useLanguage() {
  const language = useStoryStore((s) => s.language);
  const setLanguage = useStoryStore((s) => s.setLanguage);
  return { language, setLanguage };
}

export function useTranslation() {
  const { language, setLanguage } = useLanguage();

  const translate = useCallback(
    (key: TranslationKey, vars?: Record<string, string>) =>
      t(language, key, vars),
    [language],
  );

  return {
    language,
    setLanguage,
    t: translate,
    strings: translations[language],
  };
}

export type { Language };
