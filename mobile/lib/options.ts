import type { Language } from "./language";
import { t, type TranslationKey } from "./translations";

/** Stable API / storage ids — never localize these values. */
export type InterestId =
  | "dinosaurs"
  | "space"
  | "cricket"
  | "princesses"
  | "animals"
  | "ocean"
  | "something_else";

export type LessonId =
  | "none"
  | "sharing"
  | "courage"
  | "kindness"
  | "trying_new_things"
  | "bedtime_calm";

export type AgeGroup = "3-5" | "6-8" | "9-11";

/** @deprecated Prefer InterestId — kept for reading older stored stories. */
export type StoryInterest =
  | InterestId
  | "Dinosaurs"
  | "Space"
  | "Cricket"
  | "Princesses"
  | "Animals"
  | "Ocean"
  | "Something else";

/** @deprecated Prefer LessonId */
export type StoryLesson =
  | LessonId
  | "None"
  | "Sharing"
  | "Courage"
  | "Kindness"
  | "Trying new things"
  | "Bedtime calm";

const INTEREST_LABEL_KEYS: Record<InterestId, TranslationKey> = {
  dinosaurs: "interest_dinosaurs",
  space: "interest_space",
  cricket: "interest_cricket",
  princesses: "interest_princesses",
  animals: "interest_animals",
  ocean: "interest_ocean",
  something_else: "interest_something_else",
};

const LESSON_LABEL_KEYS: Record<LessonId, TranslationKey> = {
  none: "lesson_none",
  sharing: "lesson_sharing",
  courage: "lesson_courage",
  kindness: "lesson_kindness",
  trying_new_things: "lesson_trying_new_things",
  bedtime_calm: "lesson_bedtime_calm",
};

const LEGACY_INTEREST: Record<string, InterestId> = {
  Dinosaurs: "dinosaurs",
  Space: "space",
  Cricket: "cricket",
  Princesses: "princesses",
  Animals: "animals",
  Ocean: "ocean",
  "Something else": "something_else",
};

const LEGACY_LESSON: Record<string, LessonId> = {
  None: "none",
  Sharing: "sharing",
  Courage: "courage",
  Kindness: "kindness",
  "Trying new things": "trying_new_things",
  "Bedtime calm": "bedtime_calm",
};

export const INTEREST_OPTIONS: InterestId[] = [
  "dinosaurs",
  "space",
  "cricket",
  "princesses",
  "animals",
  "ocean",
  "something_else",
];

export const LESSON_OPTIONS: LessonId[] = [
  "none",
  "sharing",
  "courage",
  "kindness",
  "trying_new_things",
  "bedtime_calm",
];

export const AGES: AgeGroup[] = ["3-5", "6-8", "9-11"];

export function normalizeInterest(value: string): InterestId {
  if (value in INTEREST_LABEL_KEYS) return value as InterestId;
  return LEGACY_INTEREST[value] ?? "space";
}

export function normalizeLesson(value: string): LessonId {
  if (value in LESSON_LABEL_KEYS) return value as LessonId;
  return LEGACY_LESSON[value] ?? "bedtime_calm";
}

export function interestLabel(id: InterestId | string, lang: Language): string {
  const key = INTEREST_LABEL_KEYS[normalizeInterest(id)];
  return t(lang, key);
}

export function lessonLabel(id: LessonId | string, lang: Language): string {
  const key = LESSON_LABEL_KEYS[normalizeLesson(id)];
  return t(lang, key);
}

/** English theme word for stub templates / English generation. */
export function interestThemeEn(id: InterestId): string {
  return t("en", INTEREST_LABEL_KEYS[id]);
}

/** Hindi theme word for stub Hindi templates. */
export function interestThemeHi(id: InterestId): string {
  return t("hi", INTEREST_LABEL_KEYS[id]);
}
