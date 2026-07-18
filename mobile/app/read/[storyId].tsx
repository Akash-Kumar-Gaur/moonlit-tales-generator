import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { BackButton, ReadAloudButton, SaveButton } from "@/components/Icons";
import { MoonProgress } from "@/components/MoonProgress";
import {
  DropCapParagraph,
  StoryParagraph,
} from "@/components/StoryParagraph";
import { colors } from "@/lib/colors";
import { useTranslation } from "@/lib/i18n";
import { ttsLocales, type Language } from "@/lib/language";
import { useStoryStore } from "@/lib/store";
import { useContentFont, useThemeFont } from "@/lib/theme-fonts";
import { findStory, type Story } from "@/lib/stories";

async function resolveTtsLocale(appLang: Language): Promise<{
  locale: string;
  hindiMissing: boolean;
}> {
  const { primary, fallback } = ttsLocales(appLang);
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (appLang === "hi") {
      const hasHi = voices.some((v) => {
        const lang = (v.language || "").toLowerCase().replace("_", "-");
        return lang === "hi-in" || lang.startsWith("hi");
      });
      return { locale: "hi-IN", hindiMissing: voices.length > 0 && !hasHi };
    }
    const hasEnIn = voices.some((v) => {
      const lang = (v.language || "").toLowerCase().replace("_", "-");
      return lang === "en-in" || lang.startsWith("en-in");
    });
    return {
      locale: hasEnIn ? primary : (fallback ?? primary),
      hindiMissing: false,
    };
  } catch {
    return {
      locale: appLang === "hi" ? "hi-IN" : (fallback ?? primary),
      hindiMissing: false,
    };
  }
}

export default function ReadStoryScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const library = useStoryStore((s) => s.library);
  const story = findStory(storyId ?? "", library);

  if (!story) {
    return <NotFound />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StoryReader story={story} />
    </>
  );
}

function NotFound() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const fonts = useThemeFont();
  return (
    <View
      style={[
        styles.notFound,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={[styles.notFoundTitle, { fontFamily: fonts.serifItalic }]}>
        {t("storyDriftedAway")}
      </Text>
      <Pressable style={styles.notFoundBtn} onPress={() => router.replace("/")}>
        <Text
          style={[styles.notFoundBtnText, { fontFamily: fonts.sansMedium }]}
        >
          {t("backToLibrary")}
        </Text>
      </Pressable>
    </View>
  );
}

function StoryReader({ story }: { story: Story }) {
  const insets = useSafeAreaInsets();
  const { t, language: uiLanguage } = useTranslation();
  const contentLang = story.language ?? uiLanguage;
  const uiFonts = useThemeFont();
  const contentFonts = useContentFont(contentLang);
  const [progress, setProgress] = useState(0);
  const toggleSaved = useStoryStore((s) => s.toggleSaved);
  const isSaved = useStoryStore((s) => s.isSaved(story.id));
  const [reading, setReading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const max = contentSize.height - layoutMeasurement.height;
      const p = max <= 0 ? 1 : Math.min(1, Math.max(0, contentOffset.y / max));
      setProgress(p);
    },
    [],
  );

  const onReadAloud = useCallback(async () => {
    if (reading) {
      Speech.stop();
      setReading(false);
      return;
    }

    const text = story.paragraphs
      .map((p) => p.trim().replace(/\.+$/, ""))
      .filter(Boolean)
      .join(". ");

    if (!text) return;

    const { locale, hindiMissing } = await resolveTtsLocale(contentLang);

    if (contentLang === "hi" && hindiMissing) {
      showToast(t("ttsHindiUnavailable"));
      return;
    }

    try {
      setReading(true);
      Speech.speak(text, {
        language: locale,
        rate: 0.85,
        pitch: 1.0,
        onDone: () => setReading(false),
        onStopped: () => setReading(false),
        onError: () => {
          setReading(false);
          showToast(
            contentLang === "hi"
              ? t("ttsHindiUnavailable")
              : t("ttsUnavailable"),
          );
        },
      });
    } catch {
      setReading(false);
      showToast(
        contentLang === "hi" ? t("ttsHindiUnavailable") : t("ttsUnavailable"),
      );
    }
  }, [reading, story.paragraphs, contentLang, showToast, t]);

  const isHiUi = uiLanguage === "hi";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[colors.paperRadial, "transparent"]}
        locations={[0, 0.7]}
        style={styles.topWash}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", colors.paperRadial]}
        locations={[0.3, 1]}
        style={styles.bottomWash}
        pointerEvents="none"
      />

      <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
        <BackButton
          onPress={() => {
            Speech.stop();
            setReading(false);
            router.back();
          }}
          label={t("backHome")}
        />
        <View style={styles.navTitleWrap}>
          <Text
            style={[styles.navTitle, { fontFamily: contentFonts.serifItalic }]}
            numberOfLines={1}
          >
            {story.title}
          </Text>
        </View>
        <MoonProgress value={progress} label={t("storyProgress")} />
      </View>

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: 160 + insets.bottom },
        ]}
      >
        <View style={styles.articleHeader}>
          <Text
            style={[
              styles.forLabel,
              {
                fontFamily: uiFonts.sans,
                letterSpacing: isHiUi ? 0.5 : 3,
                textTransform: isHiUi ? "none" : "uppercase",
              },
            ]}
          >
            {t("forChild", { name: story.childName })}
          </Text>
          <Text
            style={[styles.storyTitle, { fontFamily: contentFonts.serifItalic }]}
          >
            {story.title}
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.article}>
          {story.paragraphs.map((p, i) =>
            i === 0 ? (
              <DropCapParagraph key={i} text={p} fonts={contentFonts} />
            ) : (
              <StoryParagraph key={i} text={p} fonts={contentFonts} />
            ),
          )}
          <Text
            style={[
              styles.theEnd,
              {
                fontFamily: uiFonts.sans,
                letterSpacing: isHiUi ? 0.5 : 3,
                textTransform: isHiUi ? "none" : "uppercase",
              },
            ]}
          >
            {t("theEnd")}
          </Text>
        </View>
      </ScrollView>

      <LinearGradient
        colors={[`${colors.paper}00`, colors.paper, colors.paper]}
        locations={[0, 0.4, 1]}
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 32) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.actions}>
          <ReadAloudButton
            reading={reading}
            onPress={onReadAloud}
            label={reading ? t("readingAloud") : t("readAloud")}
            fontFamily={uiFonts.sansMedium}
          />
          <SaveButton
            saved={isSaved}
            onPress={() => toggleSaved(story.id)}
            label={t("saveToLibrary")}
          />
        </View>
      </LinearGradient>

      {toast && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(200)}
          style={[styles.toast, { bottom: 100 + insets.bottom }]}
          pointerEvents="none"
        >
          <Text style={[styles.toastText, { fontFamily: uiFonts.sansMedium }]}>
            {toast}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  topWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    opacity: 0.6,
  },
  bottomWash: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    opacity: 0.6,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 2,
  },
  navTitleWrap: { flex: 1, minWidth: 0, paddingHorizontal: 4 },
  navTitle: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    color: colors.ink,
  },
  body: { paddingHorizontal: 32, paddingTop: 24 },
  articleHeader: {
    maxWidth: 340,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 40,
  },
  forLabel: { fontSize: 10, color: colors.ink50 },
  storyTitle: {
    marginTop: 12,
    fontSize: 36,
    lineHeight: 42,
    textAlign: "center",
    color: colors.ink,
  },
  divider: {
    marginTop: 24,
    height: 1,
    width: 40,
    backgroundColor: colors.ink20,
  },
  article: {
    maxWidth: 340,
    width: "100%",
    alignSelf: "center",
    gap: 32,
  },
  theEnd: {
    paddingTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: colors.ink40,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  actions: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 12,
  },
  notFound: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  notFoundTitle: {
    fontSize: 28,
    color: colors.ink,
    textAlign: "center",
  },
  notFoundBtn: {
    backgroundColor: colors.ink,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  notFoundBtnText: { fontSize: 14, color: colors.paper },
  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    alignSelf: "center",
    maxWidth: 360,
    backgroundColor: colors.ink,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 20,
  },
  toastText: {
    fontSize: 13,
    color: colors.paper,
    textAlign: "center",
  },
});
