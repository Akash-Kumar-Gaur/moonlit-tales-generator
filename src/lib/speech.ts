import { ttsLocales, type Language } from "./language";

export type SpeakResult = "started" | "stopped" | "unavailable" | "hindi-unavailable";

function voiceMatches(langTag: string, voiceLang: string): boolean {
  const a = langTag.toLowerCase().replace("_", "-");
  const b = voiceLang.toLowerCase().replace("_", "-");
  return b === a || b.startsWith(a.split("-")[0]);
}

function resolveUtteranceLang(appLang: Language): {
  lang: string;
  hasVoice: boolean;
} {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return { lang: "en-US", hasVoice: false };
  }

  const { primary, fallback } = ttsLocales(appLang);
  const voices = window.speechSynthesis.getVoices();

  if (appLang === "hi") {
    const hi = voices.find((v) => voiceMatches("hi-IN", v.lang) || voiceMatches("hi", v.lang));
    return { lang: "hi-IN", hasVoice: Boolean(hi) || voices.length === 0 };
    // If voices list is empty (not yet loaded), allow attempt; onerror handles failure
  }

  const enIn = voices.find((v) => voiceMatches(primary, v.lang));
  if (enIn) return { lang: primary, hasVoice: true };
  const enUs = fallback
    ? voices.find((v) => voiceMatches(fallback, v.lang))
    : undefined;
  if (enUs && fallback) return { lang: fallback, hasVoice: true };
  return { lang: fallback ?? primary, hasVoice: voices.length === 0 || true };
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function speakStory(
  text: string,
  appLang: Language,
  handlers: {
    onDone: () => void;
    onStopped: () => void;
    onError: (kind: "unavailable" | "hindi-unavailable") => void;
  },
): SpeakResult {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    handlers.onError("unavailable");
    return "unavailable";
  }

  const { lang, hasVoice } = resolveUtteranceLang(appLang);

  // Hindi: refuse to start in an English voice if we know Hindi isn't installed
  if (appLang === "hi") {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const hi = voices.some(
        (v) => voiceMatches("hi-IN", v.lang) || voiceMatches("hi", v.lang),
      );
      if (!hi) {
        handlers.onError("hindi-unavailable");
        return "hindi-unavailable";
      }
    }
  }

  stopSpeaking();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => handlers.onDone();
    utterance.onerror = () => {
      if (appLang === "hi") handlers.onError("hindi-unavailable");
      else handlers.onError("unavailable");
    };
    // Some browsers fire 'end' after cancel — treat cancel via onStopped when we stop intentionally
    void hasVoice;
    window.speechSynthesis.speak(utterance);
    return "started";
  } catch {
    handlers.onError(appLang === "hi" ? "hindi-unavailable" : "unavailable");
    return "unavailable";
  }
}
