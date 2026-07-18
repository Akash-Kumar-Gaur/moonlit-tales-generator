import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RECENT_STORIES, TONIGHT_STORY, type Story } from "@/lib/stories";

export const Route = createFileRoute("/read/$storyId")({
  loader: ({ params }) => {
    const story =
      params.storyId === "tonight"
        ? TONIGHT_STORY
        : RECENT_STORIES.find((s) => s.id === params.storyId);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Story not found — Moonlit Tales" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${loaderData.story.title} — Moonlit Tales` },
        {
          name: "description",
          content: `A bedtime story for ${loaderData.story.childName} — read together on Moonlit Tales.`,
        },
        { property: "og:title", content: `${loaderData.story.title} — Moonlit Tales` },
        {
          property: "og:description",
          content: `A bedtime story for ${loaderData.story.childName}.`,
        },
      ],
    };
  },
  component: ReadStory,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink">
      <div className="max-w-sm space-y-4 px-6 text-center">
        <h1 className="font-serif text-3xl italic">This story has drifted away.</h1>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-paper"
        >
          Back to library
        </Link>
      </div>
    </div>
  ),
});

function ReadStory() {
  const { story } = Route.useLoaderData();
  return <StoryReader story={story} />;
}

function StoryReader({ story }: { story: Story }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [saved, setSaved] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max <= 0 ? 1 : Math.min(1, Math.max(0, el.scrollTop / max));
      setProgress(p);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="fixed inset-0 flex flex-col bg-paper text-ink">
      {/* Warm paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 40% at 50% 0%, hsl(36 40% 88%), transparent 70%), radial-gradient(60% 40% at 50% 100%, hsl(36 40% 88%), transparent 70%)",
        }}
      />

      {/* Top bar */}
      <nav className="relative flex items-center justify-between gap-3 px-6 pt-12 pb-4 sm:px-8">
        <Link
          to="/"
          aria-label="Back to home"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/[0.04] text-ink transition-colors hover:bg-ink/[0.08]"
        >
          <BackIcon />
        </Link>

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="truncate font-serif text-base italic leading-tight">
            {story.title}
          </p>
        </div>

        <MoonProgress value={progress} />
      </nav>

      {/* Body */}
      <div
        ref={scrollRef}
        className="no-scrollbar relative flex-1 overflow-y-auto px-8 pt-6 pb-40 sm:px-10"
      >
        <header className="mx-auto max-w-[36ch] pb-10 pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink/50">
            For {story.childName}
          </p>
          <h1 className="mt-3 font-serif text-[2.25rem] italic leading-[1.1] text-balance">
            {story.title}
          </h1>
          <div className="mx-auto mt-6 h-px w-10 bg-ink/20" />
        </header>

        <article className="mx-auto max-w-[36ch] space-y-8 font-serif text-[1.15rem] leading-[1.85] text-ink/90 text-pretty">
          {story.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "first-letter:font-serif first-letter:text-5xl first-letter:italic first-letter:mr-1 first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1" : undefined}>
              {p}
            </p>
          ))}
          <p className="pt-6 text-center text-sm not-italic tracking-[0.3em] uppercase text-ink/40">
            · The End ·
          </p>
        </article>
      </div>

      {/* Bottom actions */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 pt-16 sm:px-8"
        style={{
          background:
            "linear-gradient(to top, hsl(36 30% 94%) 40%, hsl(36 30% 94% / 0) 100%)",
        }}
      >
        <div className="pointer-events-auto mx-auto flex max-w-[440px] gap-3">
          <button
            type="button"
            onClick={() => setReading((r) => !r)}
            aria-pressed={reading}
            className={
              "flex h-14 flex-[2] items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-colors " +
              (reading
                ? "bg-candle text-night shadow-candle"
                : "bg-ink text-paper hover:bg-ink/90")
            }
          >
            <SpeakerIcon active={reading} />
            <span>{reading ? "Reading aloud…" : "Read aloud"}</span>
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label="Save to library"
            className="grid h-14 flex-1 place-items-center rounded-2xl border border-ink/10 bg-ink/[0.04] text-ink transition-colors hover:bg-ink/[0.08]"
          >
            <HeartIcon filled={saved} />
          </button>
        </div>
      </div>
    </main>
  );
}

/* ————— Moon-phase progress marker ————— */
function MoonProgress({ value }: { value: number }) {
  const phases = 6;
  // fully-filled count grows with progress; last partial phase becomes a crescent
  const filled = Math.round(value * (phases - 1));
  return (
    <div
      className="flex shrink-0 items-center gap-1.5"
      role="progressbar"
      aria-label="Story progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      {Array.from({ length: phases }).map((_, i) => (
        <MoonDot key={i} state={i < filled ? "full" : i === filled ? "half" : "new"} />
      ))}
    </div>
  );
}

function MoonDot({ state }: { state: "new" | "half" | "full" }) {
  if (state === "full")
    return <span className="block size-2.5 rounded-full bg-ink" />;
  if (state === "half")
    return (
      <span className="relative block size-2.5 overflow-hidden rounded-full border border-ink/60">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-ink" />
      </span>
    );
  return <span className="block size-2.5 rounded-full border border-ink/25" />;
}

/* ————— Icons (kept inline, no lucide) ————— */
function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10v4h3l4 3V7l-4 3H4z" fill="currentColor" stroke="none" />
      {active && <path d="M15 9c1.2 1 1.2 5 0 6" />}
      {active && <path d="M18 6c2.5 2 2.5 10 0 12" opacity="0.6" />}
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
    </svg>
  );
}
