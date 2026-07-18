import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/language";
import { useTranslation } from "@/lib/i18n";
import { GenerateStoryError, generateStory } from "@/lib/generate";
import { loadingStatuses } from "@/lib/translations";
import {
  AGES,
  INTEREST_OPTIONS,
  LESSON_OPTIONS,
  RECENT_STORIES,
  displayInterest,
  getEveningGreeting,
  interestLabel,
  lessonLabel,
  localizeStoryDate,
  type AgeGroup,
  type InterestId,
  type LessonId,
} from "@/lib/stories";

export const Route = createFileRoute("/")({
  component: CreateStory,
});

function LanguageSwitcher({
  language,
  onChange,
}: {
  language: Language;
  onChange: (lang: Language) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-border bg-white/[0.04] p-1"
      role="group"
      aria-label="Language"
    >
      {SUPPORTED_LANGUAGES.map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all " +
              (active
                ? "border border-candle/60 bg-candle/10 text-candle"
                : "border border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {LANGUAGE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}

function CreateStory() {
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const greeting = useMemo(() => getEveningGreeting(language), [language]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup>("6-8");
  const [interest, setInterest] = useState<InterestId>("space");
  const [customInterest, setCustomInterest] = useState("");
  const [lesson, setLesson] = useState<LessonId>("bedtime_calm");
  const [weaving, setWeaving] = useState(false);
  const [weaveError, setWeaveError] = useState<string | null>(null);
  const statuses = loadingStatuses(language);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!weaving) {
      setStatusIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % statuses.length);
    }, 1500);
    return () => window.clearInterval(id);
  }, [weaving, statuses.length]);

  async function onWeave(e?: React.FormEvent) {
    e?.preventDefault();
    if (weaving) return;
    setWeaveError(null);
    setWeaving(true);
    try {
      const story = await generateStory({
        childName: name,
        age,
        interest,
        customInterest,
        lesson,
        language,
      });
      sessionStorage.setItem(`moonlit_story_${story.id}`, JSON.stringify(story));
      navigate({ to: "/read/$storyId", params: { storyId: story.id } });
    } catch (err) {
      const message =
        err instanceof GenerateStoryError
          ? err.message
          : t("weaveError");
      setWeaveError(message || t("weaveError"));
      setWeaving(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-night text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(38 90% 65% / 0.14), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 12%, hsl(36 30% 94% / 0.6), transparent 60%), radial-gradient(1px 1px at 78% 22%, hsl(36 30% 94% / 0.5), transparent 60%), radial-gradient(1px 1px at 55% 38%, hsl(36 30% 94% / 0.4), transparent 60%), radial-gradient(1px 1px at 12% 55%, hsl(36 30% 94% / 0.3), transparent 60%), radial-gradient(1px 1px at 88% 65%, hsl(36 30% 94% / 0.4), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-6 pb-16 pt-12 sm:px-8">
        <div className="animate-fade-rise mb-6 flex justify-end">
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </div>

        <header className="animate-fade-rise mb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-candle/80">
            {t("brand")} · {greeting.eyebrow}
          </p>
          <h1 className="mt-3 whitespace-pre-line font-serif text-[2rem] italic leading-[1.1] text-balance">
            {greeting.headline}
          </h1>
        </header>

        <form className="animate-fade-rise space-y-7" onSubmit={onWeave}>
          <Field label={t("childNameLabel")}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("childNamePlaceholder")}
              maxLength={30}
              className="w-full rounded-2xl border border-border bg-input px-5 py-4 font-sans text-base text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-candle/60"
            />
          </Field>

          <Field label={t("ageGroupLabel")}>
            <div className="flex gap-2">
              {AGES.map((a) => {
                const active = age === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    className={
                      "flex-1 rounded-xl border py-3 text-sm font-medium transition-all " +
                      (active
                        ? "border-candle bg-candle text-night shadow-candle"
                        : "border-border bg-white/[0.04] text-muted-foreground hover:text-foreground")
                    }
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label={t("interestLabel")}>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => {
                const active = interest === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInterest(i)}
                    className={
                      "rounded-full border px-4 py-2 text-xs transition-all " +
                      (active
                        ? "border-candle/60 bg-candle/10 text-candle"
                        : "border-border bg-white/[0.04] text-muted-foreground hover:text-foreground")
                    }
                  >
                    {interestLabel(i, language)}
                  </button>
                );
              })}
            </div>
            {interest === "something_else" && (
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                autoFocus
                placeholder={t("customInterestPlaceholder")}
                className="mt-3 w-full rounded-2xl border border-border bg-input px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-candle/60"
              />
            )}
          </Field>

          <Field label={t("lessonLabel")}>
            <div className="relative">
              <select
                value={lesson}
                onChange={(e) => setLesson(e.target.value as LessonId)}
                className="w-full appearance-none rounded-2xl border border-border bg-input px-5 py-4 pr-10 font-sans text-base text-foreground outline-none focus:border-candle/60"
              >
                {LESSON_OPTIONS.map((l) => (
                  <option key={l} value={l} className="bg-night text-foreground">
                    {lessonLabel(l, language)}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                ⌄
              </span>
            </div>
          </Field>

          {weaveError && (
            <div className="rounded-2xl border border-candle/30 bg-candle/10 px-5 py-4 text-center">
              <p className="font-serif text-base italic text-candle">
                {weaveError}
              </p>
              <button
                type="button"
                onClick={() => onWeave()}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-candle px-4 py-2 text-sm font-medium text-night"
              >
                {t("tryAgain")}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={weaving}
            className="group mt-2 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground shadow-lift transition-transform active:scale-[0.99] disabled:opacity-70"
          >
            <span className="font-serif text-xl italic">{t("weaveCta")}</span>
            <span className="text-lg transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </form>

        <section className="animate-fade-rise mt-14">
          <div className="mb-4 flex items-baseline justify-between px-1">
            <h2 className="font-serif text-xl italic">{t("recentStories")}</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t("library")}
            </span>
          </div>
          <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-4 sm:-mx-8 sm:px-8">
            {RECENT_STORIES.map((s, idx) => (
              <Link
                key={s.id}
                to="/read/$storyId"
                params={{ storyId: s.id }}
                className="group relative flex min-w-[180px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors hover:border-candle/40"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-40 blur-2xl"
                  style={{
                    background:
                      idx === 0
                        ? "hsl(38 90% 65%)"
                        : idx === 1
                          ? "hsl(210 60% 70%)"
                          : "hsl(140 30% 65%)",
                  }}
                />
                <div className="relative space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-candle/70">
                    {displayInterest(s, language)}
                  </p>
                  <p className="font-serif text-base italic leading-tight text-foreground">
                    {s.title}
                  </p>
                </div>
                <p className="relative mt-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {s.childName} · {localizeStoryDate(s.date, language)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {weaving && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-night/95 px-6">
          <div
            aria-hidden
            className="mb-6 size-16 animate-pulse rounded-full bg-candle/20 shadow-candle"
          />
          <p className="font-serif text-xl italic text-candle/80">
            {statuses[statusIndex]}
          </p>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="ml-1 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
