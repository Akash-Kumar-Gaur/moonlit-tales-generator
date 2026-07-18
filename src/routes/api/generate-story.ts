import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { generateStoryBodySchema } from "@/lib/generate-schema";
import {
  checkAndIncrementRateLimit,
  refundRateLimit,
} from "@/lib/rate-limit";

export const Route = createFileRoute("/api/generate-story")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json(
            { error: "invalid_json", message: "Request body must be JSON" },
            { status: 400 },
          );
        }

        const parsed = generateStoryBodySchema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            {
              error: "validation_failed",
              message: "Invalid story request",
              details: parsed.error.flatten(),
            },
            { status: 400 },
          );
        }

        const body = parsed.data;
        const rate = checkAndIncrementRateLimit(body.deviceId);
        if (!rate.allowed) {
          return Response.json(
            {
              error: "rate_limited",
              message: "Daily story limit reached. Try again tomorrow.",
              limit: rate.limit,
              remaining: 0,
            },
            {
              status: 429,
              headers: {
                "X-RateLimit-Limit": String(rate.limit),
                "X-RateLimit-Remaining": "0",
              },
            },
          );
        }

        try {
          // Dynamic import keeps the OpenAI SDK out of the client bundle
          const { generateStoryWithOpenAI } = await import("@/lib/openai-story");
          const story = await generateStoryWithOpenAI(body);
          const id = crypto.randomUUID();

          return Response.json(
            {
              id,
              title: story.title,
              paragraphs: story.paragraphs,
            },
            {
              status: 200,
              headers: {
                "X-RateLimit-Limit": String(rate.limit),
                "X-RateLimit-Remaining": String(rate.remaining),
              },
            },
          );
        } catch (error) {
          refundRateLimit(body.deviceId);
          console.error("generate-story failed:", error);

          const message =
            error instanceof Error ? error.message : "Generation failed";
          const isConfig = message.includes("OPENAI_API_KEY");

          return Response.json(
            {
              error: isConfig ? "misconfigured" : "generation_failed",
              message: isConfig
                ? "Story weaving isn't configured on the server yet"
                : "Couldn't weave your story right now — try again?",
            },
            { status: isConfig ? 503 : 502 },
          );
        }
      },
    },
  },
});
