import { z } from "zod";

export const INTEREST_IDS = [
  "dinosaurs",
  "space",
  "cricket",
  "princesses",
  "animals",
  "ocean",
  "something_else",
] as const;

export const LESSON_IDS = [
  "none",
  "sharing",
  "courage",
  "kindness",
  "trying_new_things",
  "bedtime_calm",
] as const;

export const AGE_GROUPS = ["3-5", "6-8", "9-11"] as const;

export const generateStoryBodySchema = z
  .object({
    childName: z
      .string()
      .trim()
      .min(1, "Child's name is required")
      .max(30, "Child's name must be 30 characters or fewer"),
    ageGroup: z.enum(AGE_GROUPS),
    interest: z.enum(INTEREST_IDS),
    customInterest: z.string().trim().max(60).optional(),
    lesson: z.enum(LESSON_IDS),
    deviceId: z.string().trim().min(8).max(80),
    language: z.enum(["en", "hi"]).default("en"),
  })
  .superRefine((data, ctx) => {
    if (data.interest === "something_else") {
      const custom = data.customInterest?.trim() ?? "";
      if (!custom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customInterest"],
          message: "Please describe tonight's interest",
        });
      }
    }
  });

export type GenerateStoryBody = z.infer<typeof generateStoryBodySchema>;

export const storyOutputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  paragraphs: z.array(z.string().trim().min(1)).min(3).max(8),
});

export type StoryOutput = z.infer<typeof storyOutputSchema>;
