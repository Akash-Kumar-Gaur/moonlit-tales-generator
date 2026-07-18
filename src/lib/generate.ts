import type { Language } from "./language";
import type { AgeGroup, InterestId, LessonId } from "./options";
import type { Story } from "./stories";
import { t } from "./translations";
import { getDeviceId } from "./device";

export interface GenerateStoryRequest {
  childName: string;
  age: AgeGroup;
  interest: InterestId;
  customInterest?: string;
  lesson: LessonId;
  language: Language;
}

export class GenerateStoryError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "GenerateStoryError";
    this.code = code;
    this.status = status;
  }
}

interface ApiSuccess {
  id: string;
  title: string;
  paragraphs: string[];
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

/**
 * POST /api/generate-story — real OpenAI generation on the server.
 * Client fills childName / interest / date when saving locally.
 */
export async function generateStory(
  req: GenerateStoryRequest,
): Promise<Story> {
  const deviceId = getDeviceId();

  const res = await fetch("/api/generate-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      childName: req.childName.trim() || "Leo",
      ageGroup: req.age,
      interest: req.interest,
      customInterest: req.customInterest,
      lesson: req.lesson,
      deviceId,
      language: req.language,
    }),
  });

  let body: ApiSuccess | ApiErrorBody = {};
  try {
    body = (await res.json()) as ApiSuccess | ApiErrorBody;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const code =
      typeof (body as ApiErrorBody).error === "string"
        ? (body as ApiErrorBody).error!
        : "generation_failed";
    const message =
      typeof (body as ApiErrorBody).message === "string"
        ? (body as ApiErrorBody).message!
        : "Couldn't weave your story right now — try again?";
    throw new GenerateStoryError(message, code, res.status);
  }

  const data = body as ApiSuccess;
  if (!data.id || !data.title || !Array.isArray(data.paragraphs)) {
    throw new GenerateStoryError(
      "Couldn't weave your story right now — try again?",
      "invalid_response",
      502,
    );
  }

  return {
    id: data.id,
    title: data.title,
    paragraphs: data.paragraphs,
    childName: req.childName.trim() || "Leo",
    interest: req.interest,
    date: t(req.language, "dateTonight"),
    language: req.language,
  };
}
