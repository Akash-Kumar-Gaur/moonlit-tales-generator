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

function apiBase(): string {
  // Set EXPO_PUBLIC_API_URL to your deployed TanStack Start origin (no trailing slash).
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  return fromEnv || "";
}

/** POST to the web app's /api/generate-story endpoint. */
export async function generateStory(
  req: GenerateStoryRequest,
): Promise<Story> {
  const deviceId = await getDeviceId();
  const base = apiBase();
  if (!base) {
    throw new GenerateStoryError(
      "API URL isn't configured. Set EXPO_PUBLIC_API_URL to your Moonlit Tales server.",
      "misconfigured",
      503,
    );
  }

  let res: Response;
  try {
    res = await fetch(`${base}/api/generate-story`, {
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
  } catch {
    throw new GenerateStoryError(
      t(req.language, "weaveError"),
      "network_error",
      0,
    );
  }

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
        : t(req.language, "weaveError");
    throw new GenerateStoryError(message, code, res.status);
  }

  const data = body as ApiSuccess;
  if (!data.id || !data.title || !Array.isArray(data.paragraphs)) {
    throw new GenerateStoryError(
      t(req.language, "weaveError"),
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
