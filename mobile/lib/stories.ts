import type { Language } from "./language";
import { t } from "./translations";
import {
  type AgeGroup,
  type InterestId,
  type LessonId,
  interestLabel,
} from "./options";

export type { AgeGroup, InterestId, LessonId };
export type { StoryInterest, StoryLesson } from "./options";
export {
  AGES,
  INTEREST_OPTIONS,
  LESSON_OPTIONS,
  interestLabel,
  lessonLabel,
  normalizeInterest,
  normalizeLesson,
} from "./options";

export interface Story {
  id: string;
  title: string;
  childName: string;
  date: string;
  interest: InterestId;
  paragraphs: string[];
  language?: Language;
}

export const RECENT_STORIES: Story[] = [
  {
    id: "brave-otter",
    title: "The Brave Little Otter",
    childName: "Leo",
    date: "Last night",
    interest: "ocean",
    language: "en",
    paragraphs: [
      "In a quiet cove where the moon dipped its face into the water, a small otter named Pim tucked a smooth pebble under his chin and closed his eyes.",
      "He was practicing for tomorrow, when he would swim past the kelp forest for the very first time. His mother had said it was time.",
      "Pim listened to the waves and thought of Leo, who was also learning something new, and felt very brave indeed.",
    ],
  },
  {
    id: "starlight-train",
    title: "The Starlight Train",
    childName: "Leo",
    date: "Two nights ago",
    interest: "space",
    language: "en",
    paragraphs: [
      "The Starlight Train only ran once a night, and only for children who had already brushed their teeth.",
      "Its whistle sounded like a lullaby, and its windows glowed the color of warm honey.",
      "Tonight, the conductor tipped her hat and said, quite plainly, 'Right this way, Leo.'",
    ],
  },
  {
    id: "whispering-tree",
    title: "The Whispering Tree",
    childName: "Leo",
    date: "Sunday",
    interest: "animals",
    language: "en",
    paragraphs: [
      "At the far end of the meadow stood a tree so old it had forgotten its own name.",
      "But it remembered every child who had ever leaned against its trunk, and it whispered their stories back to the wind.",
      "Tonight, the tree whispered a story just for Leo, soft as a snowfall.",
    ],
  },
];

export const TONIGHT_STORY: Story = {
  id: "dragon-who-kept-the-moon",
  title: "The Dragon Who Kept the Moon",
  childName: "Leo",
  date: "Tonight",
  interest: "space",
  language: "en",
  paragraphs: [
    "In the valley of the Silver Mist, there lived a dragon named Pip. Unlike the dragons in other books, Pip wasn't big enough to guard a castle or breathe fire that reached the clouds.",
    "Pip had a very special job. Every evening, when the sun slipped behind the jagged peaks, he would take a soft velvet cloth and polish the moon until it shone like a fresh pearl.",
    "But tonight was different. A mischievous breeze had whisked the moonlight away before Pip could even begin, leaving the whole forest in a deep, quiet hush.",
    "So Pip climbed onto the highest branch of the tallest pine and called for his friend Leo, whose window was always the last to glow before sleep.",
    "Together they whispered the moon back into the sky — one soft breath at a time — until the valley shimmered silver again and the forest let out a long, contented sigh.",
    "And when Pip finally curled up beside the tree roots, he thought of Leo, safe and warm, and closed his eyes.",
  ],
};

export function getEveningGreeting(
  lang: Language = "en",
  now: Date = new Date(),
): { eyebrow: string; headline: string } {
  const hour = now.getHours();
  const timeLabel = now
    .toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-IN", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase();

  if (hour < 17) {
    return {
      eyebrow: `${timeLabel} · ${t(lang, "greetingQuietMoment")}`,
      headline: t(lang, "greetingEarlyHeadline"),
    };
  }
  if (hour < 20) {
    return {
      eyebrow: `${timeLabel} · ${t(lang, "greetingWindingDown")}`,
      headline: t(lang, "greetingEveningHeadline"),
    };
  }
  if (hour < 23) {
    return {
      eyebrow: `${timeLabel} · ${t(lang, "greetingAlmostBedtime")}`,
      headline: t(lang, "greetingLastStoryHeadline"),
    };
  }
  return {
    eyebrow: `${timeLabel} · ${t(lang, "greetingDeepNight")}`,
    headline: t(lang, "greetingSoftSleepHeadline"),
  };
}

export function localizeStoryDate(date: string, lang: Language): string {
  const map: Record<string, string> = {
    Tonight: t(lang, "dateTonight"),
    "Last night": t(lang, "dateLastNight"),
    "Two nights ago": t(lang, "dateTwoNightsAgo"),
    Sunday: t(lang, "dateSunday"),
    "आज रात": t(lang, "dateTonight"),
    "कल रात": t(lang, "dateLastNight"),
  };
  return map[date] ?? date;
}

export function displayInterest(story: Story, lang: Language): string {
  return interestLabel(story.interest, lang);
}

export function findStory(
  storyId: string,
  library: Story[] = [],
): Story | undefined {
  if (storyId === "tonight") return TONIGHT_STORY;
  return (
    library.find((s) => s.id === storyId) ??
    RECENT_STORIES.find((s) => s.id === storyId)
  );
}
