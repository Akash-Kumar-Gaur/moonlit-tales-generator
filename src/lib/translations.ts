import type { Language } from "./language";

export type TranslationKey =
  | "brand"
  | "childNameLabel"
  | "childNamePlaceholder"
  | "ageGroupLabel"
  | "interestLabel"
  | "customInterestPlaceholder"
  | "lessonLabel"
  | "weaveCta"
  | "recentStories"
  | "library"
  | "readAloud"
  | "readingAloud"
  | "saveToLibrary"
  | "forChild"
  | "theEnd"
  | "storyDriftedAway"
  | "backToLibrary"
  | "backHome"
  | "storyProgress"
  | "loadingGathering"
  | "loadingWords"
  | "loadingReady"
  | "ttsUnavailable"
  | "ttsHindiUnavailable"
  | "lostAmongStars"
  | "pageAsleep"
  | "pageAsleepBody"
  | "candleFlickered"
  | "candleFlickeredBody"
  | "tryAgain"
  | "goHome"
  | "weaveError"
  | "greetingQuietMoment"
  | "greetingEarlyHeadline"
  | "greetingWindingDown"
  | "greetingEveningHeadline"
  | "greetingAlmostBedtime"
  | "greetingLastStoryHeadline"
  | "greetingDeepNight"
  | "greetingSoftSleepHeadline"
  | "interest_dinosaurs"
  | "interest_space"
  | "interest_cricket"
  | "interest_princesses"
  | "interest_animals"
  | "interest_ocean"
  | "interest_something_else"
  | "lesson_none"
  | "lesson_sharing"
  | "lesson_courage"
  | "lesson_kindness"
  | "lesson_trying_new_things"
  | "lesson_bedtime_calm"
  | "dateTonight"
  | "dateLastNight"
  | "dateTwoNightsAgo"
  | "dateSunday";

export type Translations = Record<TranslationKey, string>;

export const translations: Record<Language, Translations> = {
  en: {
    brand: "Moonlit Tales",
    childNameLabel: "Child's name",
    childNamePlaceholder: "Leo",
    ageGroupLabel: "Age group",
    interestLabel: "Tonight's interest",
    customInterestPlaceholder: "What's on their mind?",
    lessonLabel: "A gentle lesson (optional)",
    weaveCta: "Weave tonight's story",
    recentStories: "Recent stories",
    library: "Library",
    readAloud: "Read aloud",
    readingAloud: "Reading aloud…",
    saveToLibrary: "Save to library",
    forChild: "For {name}",
    theEnd: "· The End ·",
    storyDriftedAway: "This story has drifted away.",
    backToLibrary: "Back to library",
    backHome: "Back home",
    storyProgress: "Story progress",
    loadingGathering: "Gathering starlight...",
    loadingWords: "Finding the right words...",
    loadingReady: "Almost ready...",
    ttsUnavailable: "Text-to-speech isn't available on this device",
    ttsHindiUnavailable: "Hindi voice isn't available on this device",
    lostAmongStars: "Lost among stars",
    pageAsleep: "This page has drifted off to sleep.",
    pageAsleepBody:
      "The page you're looking for isn't here. Let's head back to the nightstand.",
    candleFlickered: "The candle flickered.",
    candleFlickeredBody: "Something interrupted the story. Try again in a moment.",
    tryAgain: "Try again",
    goHome: "Go home",
    weaveError: "Couldn't weave your story right now — try again?",
    greetingQuietMoment: "a quiet moment",
    greetingEarlyHeadline: "An early story,\nwhile the light lingers.",
    greetingWindingDown: "winding down",
    greetingEveningHeadline: "Good evening.\nLet's weave a dream.",
    greetingAlmostBedtime: "almost bedtime",
    greetingLastStoryHeadline: "One last story\nbefore lights out.",
    greetingDeepNight: "deep night",
    greetingSoftSleepHeadline: "Shh — a soft\nstory for sleep.",
    interest_dinosaurs: "Dinosaurs",
    interest_space: "Space",
    interest_cricket: "Cricket",
    interest_princesses: "Princesses",
    interest_animals: "Animals",
    interest_ocean: "Ocean",
    interest_something_else: "Something else",
    lesson_none: "None",
    lesson_sharing: "Sharing",
    lesson_courage: "Courage",
    lesson_kindness: "Kindness",
    lesson_trying_new_things: "Trying new things",
    lesson_bedtime_calm: "Bedtime calm",
    dateTonight: "Tonight",
    dateLastNight: "Last night",
    dateTwoNightsAgo: "Two nights ago",
    dateSunday: "Sunday",
  },
  hi: {
    brand: "Moonlit Tales",
    childNameLabel: "बच्चे का नाम",
    childNamePlaceholder: "Leo",
    ageGroupLabel: "उम्र",
    interestLabel: "आज रात की दिलचस्पी",
    customInterestPlaceholder: "उनके मन में क्या है?",
    lessonLabel: "एक नर्म सीख (वैकल्पिक)",
    weaveCta: "आज रात की कहानी बुनें",
    recentStories: "हाल की कहानियाँ",
    library: "लाइब्रेरी",
    readAloud: "ज़ोर से पढ़ें",
    readingAloud: "पढ़ रहा हूँ…",
    saveToLibrary: "लाइब्रेरी में सहेजें",
    forChild: "{name} के लिए",
    theEnd: "· समाप्त ·",
    storyDriftedAway: "यह कहानी कहीं खो गई।",
    backToLibrary: "लाइब्रेरी पर वापस जाएँ",
    backHome: "होम पर वापस",
    storyProgress: "कहानी की प्रगति",
    loadingGathering: "तारों की रोशनी जमा कर रहे हैं...",
    loadingWords: "सही शब्द ढूँढ रहे हैं...",
    loadingReady: "लगभग तैयार...",
    ttsUnavailable: "इस डिवाइस पर आवाज़ से पढ़ना उपलब्ध नहीं है",
    ttsHindiUnavailable: "इस डिवाइस पर हिंदी आवाज़ उपलब्ध नहीं है",
    lostAmongStars: "तारों में खो गए",
    pageAsleep: "यह पन्ना सो गया लगता है।",
    pageAsleepBody:
      "जो पन्ना आप ढूँढ रहे हैं, वह यहाँ नहीं है। चलिए वापस रात की मेज़ पर चलते हैं।",
    candleFlickered: "मोमबत्ती काँप गई।",
    candleFlickeredBody:
      "कहानी बीच में रुक गई। थोड़ी देर बाद फिर से कोशिश करें।",
    tryAgain: "फिर कोशिश करें",
    goHome: "होम जाएँ",
    weaveError: "अभी कहानी नहीं बन पाई — फिर से कोशिश करें?",
    greetingQuietMoment: "एक शांत पल",
    greetingEarlyHeadline: "एक जल्दी वाली कहानी,\nजब तक रोशनी बनी है।",
    greetingWindingDown: "दिन ढल रहा है",
    greetingEveningHeadline: "शुभ संध्या।\nआइए एक सपना बुनें।",
    greetingAlmostBedtime: "लगभग सोने का समय",
    greetingLastStoryHeadline: "रोशनी बंद होने से पहले\nएक आखिरी कहानी।",
    greetingDeepNight: "गहरी रात",
    greetingSoftSleepHeadline: "श्श — नींद के लिए\nएक नरम कहानी।",
    interest_dinosaurs: "डायनासोर",
    interest_space: "अंतरिक्ष",
    interest_cricket: "क्रिकेट",
    interest_princesses: "राजकुमारियाँ",
    interest_animals: "जानवर",
    interest_ocean: "समुद्र",
    interest_something_else: "कुछ और",
    lesson_none: "कोई नहीं",
    lesson_sharing: "बाँटना",
    lesson_courage: "हिम्मत",
    lesson_kindness: "दयालुता",
    lesson_trying_new_things: "नई चीज़ें आज़माना",
    lesson_bedtime_calm: "सोने की शांति",
    dateTonight: "आज रात",
    dateLastNight: "कल रात",
    dateTwoNightsAgo: "दो रात पहले",
    dateSunday: "रविवार",
  },
};

export function t(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string>,
): string {
  let value = translations[lang]?.[key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.split(`{${k}}`).join(v);
    }
  }
  return value;
}

export function loadingStatuses(lang: Language): string[] {
  return [
    t(lang, "loadingGathering"),
    t(lang, "loadingWords"),
    t(lang, "loadingReady"),
  ];
}
