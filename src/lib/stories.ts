export type StoryInterest =
  | "Dinosaurs"
  | "Space"
  | "Cricket"
  | "Princesses"
  | "Animals"
  | "Ocean"
  | "Something else";

export type AgeGroup = "3-5" | "6-8" | "9-11";

export type StoryLesson =
  | "None"
  | "Sharing"
  | "Courage"
  | "Kindness"
  | "Trying new things"
  | "Bedtime calm";

export interface Story {
  id: string;
  title: string;
  childName: string;
  date: string;
  interest: StoryInterest;
  paragraphs: string[];
}

export const RECENT_STORIES: Story[] = [
  {
    id: "brave-otter",
    title: "The Brave Little Otter",
    childName: "Leo",
    date: "Last night",
    interest: "Ocean",
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
    interest: "Space",
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
    interest: "Animals",
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
  interest: "Space",
  paragraphs: [
    "In the valley of the Silver Mist, there lived a dragon named Pip. Unlike the dragons in other books, Pip wasn't big enough to guard a castle or breathe fire that reached the clouds.",
    "Pip had a very special job. Every evening, when the sun slipped behind the jagged peaks, he would take a soft velvet cloth and polish the moon until it shone like a fresh pearl.",
    "But tonight was different. A mischievous breeze had whisked the moonlight away before Pip could even begin, leaving the whole forest in a deep, quiet hush.",
    "So Pip climbed onto the highest branch of the tallest pine and called for his friend Leo, whose window was always the last to glow before sleep.",
    "Together they whispered the moon back into the sky — one soft breath at a time — until the valley shimmered silver again and the forest let out a long, contented sigh.",
    "And when Pip finally curled up beside the tree roots, he thought of Leo, safe and warm, and closed his eyes.",
  ],
};

export function getEveningGreeting(now: Date = new Date()): {
  eyebrow: string;
  headline: string;
} {
  const hour = now.getHours();
  const timeLabel = now
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .toLowerCase();

  if (hour < 17) {
    return {
      eyebrow: `${timeLabel} · a quiet moment`,
      headline: "An early story,\nwhile the light lingers.",
    };
  }
  if (hour < 20) {
    return {
      eyebrow: `${timeLabel} · winding down`,
      headline: "Good evening.\nLet's weave a dream.",
    };
  }
  if (hour < 23) {
    return {
      eyebrow: `${timeLabel} · almost bedtime`,
      headline: "One last story\nbefore lights out.",
    };
  }
  return {
    eyebrow: `${timeLabel} · deep night`,
    headline: "Shh — a soft\nstory for sleep.",
  };
}
