import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { LessonPicker } from "@/components/LessonPicker";
import { LoadingWeave } from "@/components/LoadingWeave";
import { StarField } from "@/components/StarField";
import { colors } from "@/lib/colors";
import { generateStory, GenerateStoryError } from "@/lib/generate";
import { useTranslation } from "@/lib/i18n";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/lib/language";
import { useStoryStore } from "@/lib/store";
import { useThemeFont } from "@/lib/theme-fonts";
import {
  AGES,
  INTEREST_OPTIONS,
  displayInterest,
  getEveningGreeting,
  interestLabel,
  lessonLabel,
  localizeStoryDate,
  type AgeGroup,
  type InterestId,
  type LessonId,
  type Story,
} from "@/lib/stories";

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);

function glowForIndex(idx: number): string {
  if (idx === 0) return colors.glowCandle;
  if (idx === 1) return colors.glowBlue;
  return colors.glowGreen;
}

function LanguageSwitcher({
  language,
  onChange,
  fonts,
}: {
  language: Language;
  onChange: (lang: Language) => void;
  fonts: ReturnType<typeof useThemeFont>;
}) {
  return (
    <View style={styles.langSwitch} accessibilityRole="tablist">
      {SUPPORTED_LANGUAGES.map((code) => {
        const active = language === code;
        return (
          <Pressable
            key={code}
            onPress={() => onChange(code)}
            style={[styles.langPill, active ? styles.langPillActive : null]}
          >
            <Text
              style={[
                styles.langPillText,
                { fontFamily: fonts.sansMedium },
                active ? styles.langPillTextActive : null,
              ]}
            >
              {LANGUAGE_LABELS[code]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CreateStoryScreen() {
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useTranslation();
  const fonts = useThemeFont();
  const greeting = useMemo(() => getEveningGreeting(language), [language]);
  const library = useStoryStore((s) => s.library);
  const addStory = useStoryStore((s) => s.addStory);

  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup>("6-8");
  const [interest, setInterest] = useState<InterestId>("space");
  const [customInterest, setCustomInterest] = useState("");
  const [lesson, setLesson] = useState<LessonId>("bedtime_calm");
  const [lessonOpen, setLessonOpen] = useState(false);
  const [weaving, setWeaving] = useState(false);
  const [weaveError, setWeaveError] = useState<string | null>(null);
  const [ctaPressed, setCtaPressed] = useState(false);

  const recent = library.length > 0 ? library.slice(0, 12) : [];
  const isHi = language === "hi";

  async function onWeave() {
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
      addStory(story);
      router.push(`/read/${story.id}`);
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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.candleGlow14, "transparent"]}
        locations={[0, 0.7]}
        style={styles.glow}
        pointerEvents="none"
      />
      <StarField />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 64 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInUp.duration(900).easing(easeOutExpo)}
          style={styles.langRow}
        >
          <LanguageSwitcher
            language={language}
            onChange={setLanguage}
            fonts={fonts}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(900).easing(easeOutExpo)}
          style={styles.header}
        >
          <Text
            style={[
              styles.eyebrow,
              {
                fontFamily: fonts.sansMedium,
                letterSpacing: isHi ? 0.5 : 3,
                textTransform: isHi ? "none" : "uppercase",
              },
            ]}
          >
            {t("brand")} · {greeting.eyebrow}
          </Text>
          <Text
            style={[
              styles.headline,
              { fontFamily: fonts.serifItalic },
            ]}
          >
            {greeting.headline}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(900).delay(80).easing(easeOutExpo)}
          style={styles.form}
        >
          <Field label={t("childNameLabel")} fonts={fonts} isHi={isHi}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("childNamePlaceholder")}
              placeholderTextColor={colors.mutedForeground50}
              style={[styles.input, { fontFamily: fonts.sans }]}
            />
          </Field>

          <Field label={t("ageGroupLabel")} fonts={fonts} isHi={isHi}>
            <View style={styles.ageRow}>
              {AGES.map((a) => {
                const active = age === a;
                return (
                  <Pressable
                    key={a}
                    onPress={() => setAge(a)}
                    style={[
                      styles.ageBtn,
                      active ? styles.ageActive : styles.ageIdle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ageText,
                        { fontFamily: fonts.sansMedium },
                        active ? styles.ageTextActive : styles.ageTextIdle,
                      ]}
                    >
                      {a}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label={t("interestLabel")} fonts={fonts} isHi={isHi}>
            <View style={styles.chips}>
              {INTEREST_OPTIONS.map((i) => {
                const active = interest === i;
                return (
                  <Pressable
                    key={i}
                    onPress={() => setInterest(i)}
                    style={[
                      styles.chip,
                      active ? styles.chipActive : styles.chipIdle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { fontFamily: fonts.sans },
                        active ? styles.chipTextActive : styles.chipTextIdle,
                      ]}
                    >
                      {interestLabel(i, language)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {interest === "something_else" && (
              <Animated.View
                entering={FadeIn.duration(250)}
                layout={Layout.springify()}
              >
                <TextInput
                  value={customInterest}
                  onChangeText={setCustomInterest}
                  placeholder={t("customInterestPlaceholder")}
                  placeholderTextColor={colors.mutedForeground50}
                  autoFocus
                  style={[
                    styles.input,
                    styles.customInterest,
                    { fontFamily: fonts.sans },
                  ]}
                />
              </Animated.View>
            )}
          </Field>

          <Field label={t("lessonLabel")} fonts={fonts} isHi={isHi}>
            <Pressable
              onPress={() => setLessonOpen(true)}
              style={styles.select}
            >
              <Text style={[styles.selectText, { fontFamily: fonts.sans }]}>
                {lessonLabel(lesson, language)}
              </Text>
              <Text style={styles.chevron}>⌄</Text>
            </Pressable>
          </Field>

          {weaveError ? (
            <View style={styles.errorBox}>
              <Text
                style={[styles.errorText, { fontFamily: fonts.serifItalic }]}
              >
                {weaveError}
              </Text>
              <Pressable onPress={onWeave} style={styles.retryBtn}>
                <Text
                  style={[styles.retryText, { fontFamily: fonts.sansMedium }]}
                >
                  {t("tryAgain")}
                </Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            onPress={onWeave}
            onPressIn={() => setCtaPressed(true)}
            onPressOut={() => setCtaPressed(false)}
            disabled={weaving}
            style={[
              styles.cta,
              ctaPressed && { transform: [{ scale: 0.99 }] },
            ]}
          >
            <Text style={[styles.ctaLabel, { fontFamily: fonts.serifItalic }]}>
              {t("weaveCta")}
            </Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(900).delay(160).easing(easeOutExpo)}
          style={styles.recentSection}
        >
          <View style={styles.recentHeader}>
            <Text
              style={[styles.recentTitle, { fontFamily: fonts.serifItalic }]}
            >
              {t("recentStories")}
            </Text>
            <Text
              style={[
                styles.libraryLabel,
                {
                  fontFamily: fonts.sans,
                  letterSpacing: isHi ? 0.5 : 2,
                  textTransform: isHi ? "none" : "uppercase",
                },
              ]}
            >
              {t("library")}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
          >
            {recent.map((item, index) => (
              <RecentCard
                key={item.id}
                story={item}
                glow={glowForIndex(index % 3)}
                language={language}
                fonts={fonts}
                isHi={isHi}
                onPress={() => router.push(`/read/${item.id}`)}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      <LessonPicker
        visible={lessonOpen}
        value={lesson}
        onChange={setLesson}
        onClose={() => setLessonOpen(false)}
      />
      <LoadingWeave visible={weaving} />
    </View>
  );
}

function Field({
  label,
  children,
  fonts,
  isHi,
}: {
  label: string;
  children: React.ReactNode;
  fonts: ReturnType<typeof useThemeFont>;
  isHi: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.fieldLabel,
          {
            fontFamily: fonts.sansMedium,
            letterSpacing: isHi ? 0.5 : 2.5,
            textTransform: isHi ? "none" : "uppercase",
          },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function RecentCard({
  story,
  glow,
  onPress,
  language,
  fonts,
  isHi,
}: {
  story: Story;
  glow: string;
  onPress: () => void;
  language: Language;
  fonts: ReturnType<typeof useThemeFont>;
  isHi: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View
        pointerEvents="none"
        style={[styles.cardGlow, { backgroundColor: glow }]}
      />
      <View style={styles.cardBody}>
        <Text
          style={[
            styles.cardInterest,
            {
              fontFamily: fonts.sans,
              letterSpacing: isHi ? 0.5 : 2,
              textTransform: isHi ? "none" : "uppercase",
            },
          ]}
        >
          {displayInterest(story, language)}
        </Text>
        <Text style={[styles.cardTitle, { fontFamily: fonts.serifItalic }]}>
          {story.title}
        </Text>
      </View>
      <Text
        style={[
          styles.cardMeta,
          {
            fontFamily: fonts.sans,
            letterSpacing: isHi ? 0.5 : 1.5,
            textTransform: isHi ? "none" : "uppercase",
          },
        ]}
      >
        {story.childName} · {localizeStoryDate(story.date, language)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  langRow: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  langSwitch: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white04,
    padding: 4,
  },
  langPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  langPillActive: {
    borderColor: colors.candle60,
    backgroundColor: colors.candleSoft10,
  },
  langPillText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  langPillTextActive: {
    color: colors.candle,
  },
  header: { marginBottom: 40 },
  eyebrow: {
    fontSize: 10,
    color: colors.candle80,
  },
  headline: {
    marginTop: 12,
    fontSize: 32,
    lineHeight: 38,
    color: colors.foreground,
  },
  form: { gap: 28 },
  field: { gap: 12 },
  fieldLabel: {
    marginLeft: 4,
    fontSize: 10,
    color: colors.mutedForeground,
  },
  input: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.foreground,
  },
  customInterest: { marginTop: 12, paddingVertical: 12, fontSize: 14 },
  ageRow: { flexDirection: "row", gap: 8 },
  ageBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  ageActive: {
    borderColor: colors.candle,
    backgroundColor: colors.candle,
  },
  ageIdle: {
    borderColor: colors.border,
    backgroundColor: colors.white04,
  },
  ageText: { fontSize: 14 },
  ageTextActive: { color: colors.night },
  ageTextIdle: { color: colors.mutedForeground },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: colors.candle60,
    backgroundColor: colors.candleSoft10,
  },
  chipIdle: {
    borderColor: colors.border,
    backgroundColor: colors.white04,
  },
  chipText: { fontSize: 12 },
  chipTextActive: { color: colors.candle },
  chipTextIdle: { color: colors.mutedForeground },
  select: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 16, color: colors.foreground },
  chevron: {
    position: "absolute",
    right: 20,
    color: colors.mutedForeground,
    fontSize: 16,
  },
  cta: {
    marginTop: 8,
    height: 64,
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.paper,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#05060A",
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 8,
  },
  ctaLabel: { fontSize: 20, color: colors.night },
  ctaArrow: { fontSize: 18, color: colors.night },
  errorBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.candle60,
    backgroundColor: colors.candleSoft10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: colors.candle,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: colors.candle,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    fontSize: 14,
    color: colors.night,
  },
  recentSection: { marginTop: 56 },
  recentHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  recentTitle: { fontSize: 20, color: colors.foreground },
  libraryLabel: { fontSize: 10, color: colors.mutedForeground },
  recentList: { gap: 12, paddingBottom: 16 },
  card: {
    width: 180,
    minHeight: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.nightCard,
    padding: 16,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardGlow: {
    position: "absolute",
    right: -24,
    top: -24,
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0.4,
  },
  cardBody: { gap: 24 },
  cardInterest: { fontSize: 10, color: colors.candle70 },
  cardTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.foreground,
  },
  cardMeta: { marginTop: 24, fontSize: 10, color: colors.mutedForeground },
});
