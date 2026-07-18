import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { languageDisplayName, storyLanguageInstruction, type Language } from "./language";
import {
  interestThemeEn,
  interestThemeHi,
  type InterestId,
  type LessonId,
} from "./options";
import {
  storyOutputSchema,
  type GenerateStoryBody,
  type StoryOutput,
} from "./generate-schema";

/** OpenAI mid-tier for creative writing (verified against docs: gpt-5.6 — not Cursor's gpt-5.6-terra slug). */
const MODEL = "gpt-5.6";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

function resolveInterestLabel(body: GenerateStoryBody): string {
  if (body.interest === "something_else") {
    return body.customInterest!.trim();
  }
  return body.language === "hi"
    ? interestThemeHi(body.interest as InterestId)
    : interestThemeEn(body.interest as InterestId);
}

function resolveLessonLabel(lesson: LessonId, language: Language): string {
  if (lesson === "none") {
    return language === "hi" ? "कोई विशेष सीख नहीं" : "None";
  }
  const labels: Record<Exclude<LessonId, "none">, { en: string; hi: string }> = {
    sharing: { en: "Sharing", hi: "बाँटना" },
    courage: { en: "Courage", hi: "हिम्मत" },
    kindness: { en: "Kindness", hi: "दयालुता" },
    trying_new_things: { en: "Trying new things", hi: "नई चीज़ें आज़माना" },
    bedtime_calm: { en: "Bedtime calm", hi: "सोने की शांति" },
  };
  return labels[lesson][language];
}

export function buildSystemPrompt(ageGroup: string, language: Language): string {
  return `You write short, original bedtime stories for children. Rules:
- Age ${ageGroup}: match vocabulary and sentence complexity to this band.
  3-5 = very simple, short sentences, familiar concepts. 6-8 = slightly richer vocabulary, gentle narrative arc. 9-11 = more descriptive language, light complexity, still calm and safe.
- Never include violence, fear, danger that isn't gently resolved, or any content inappropriate for bedtime. The story should calm a child toward sleep, not excite them.
- Create ORIGINAL characters and settings only. Never use existing copyrighted characters (no Disney princesses, no franchise characters, no named existing IP) even if the stated interest is 'Princesses' or similar — invent a new character instead.
- If a lesson/theme is specified, weave it in naturally through the story's events, never as an explicit stated moral at the end.
- Include the child's name naturally in the story, as a character or someone the story is being told to/about.
- paragraphs should be 5-6 entries, each 2-4 sentences, building a gentle beginning-middle-end arc that winds down in energy toward the final paragraph.
- ${storyLanguageInstruction(language)}`;
}

function buildUserPrompt(body: GenerateStoryBody): string {
  const interest = resolveInterestLabel(body);
  const lesson = resolveLessonLabel(body.lesson as LessonId, body.language);
  const langName = languageDisplayName(body.language);
  return `Write a story for ${body.childName}, age ${body.ageGroup}, about ${interest}. Theme/lesson: ${lesson}. Write the title and all paragraphs in ${langName}.`;
}

async function callOnce(body: GenerateStoryBody): Promise<StoryOutput> {
  const client = getClient();
  const response = await client.responses.parse({
    model: MODEL,
    // gpt-5.6 rejects temperature; use default sampling.
    max_output_tokens: 4096,
    input: [
      {
        role: "system",
        content: buildSystemPrompt(body.ageGroup, body.language),
      },
      {
        role: "user",
        content: buildUserPrompt(body),
      },
    ],
    text: {
      format: zodTextFormat(storyOutputSchema, "bedtime_story"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed) {
    // Check for refusal in output
    for (const item of response.output ?? []) {
      if (item.type !== "message") continue;
      for (const part of item.content ?? []) {
        if (part.type === "refusal") {
          throw new Error("Story generation was refused");
        }
      }
    }
    throw new Error("Empty model response");
  }

  return storyOutputSchema.parse(parsed);
}

/** Call OpenAI with one validation retry. */
export async function generateStoryWithOpenAI(
  body: GenerateStoryBody,
): Promise<StoryOutput> {
  try {
    return await callOnce(body);
  } catch (firstError) {
    console.warn("Story generation attempt 1 failed, retrying once:", firstError);
    return await callOnce(body);
  }
}
