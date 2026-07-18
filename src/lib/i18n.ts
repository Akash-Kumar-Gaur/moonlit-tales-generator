import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "./language";
import { t, type TranslationKey, type Translations, translations } from "./translations";

type Listener = () => void;

let currentLanguage: Language = "en";
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function readStored(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(raw) ? raw : "en";
  } catch {
    return "en";
  }
}

function applyDomLang(lang: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
}

/** Call once on client boot (and whenever language changes). */
export function initLanguage(): Language {
  currentLanguage = readStored();
  applyDomLang(currentLanguage);
  return currentLanguage;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  if (!isLanguage(lang)) return;
  currentLanguage = lang;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    /* ignore quota / private mode */
  }
  applyDomLang(lang);
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentLanguage;
}

function getServerSnapshot() {
  return "en" as Language;
}

export function useLanguage() {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Hydrate from localStorage after mount (SSR-safe)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    initLanguage();
    setHydrated(true);
  }, []);

  const setLang = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  return { language, setLanguage: setLang, hydrated };
}

export function useTranslation() {
  const { language, setLanguage, hydrated } = useLanguage();

  const translate = useCallback(
    (key: TranslationKey, vars?: Record<string, string>) =>
      t(language, key, vars),
    [language],
  );

  const strings: Translations = translations[language];

  return {
    language,
    setLanguage,
    hydrated,
    t: translate,
    strings,
  };
}
