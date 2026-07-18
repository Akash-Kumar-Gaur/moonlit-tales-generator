import { StyleSheet, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import { colors } from "@/lib/colors";
import { useTranslation } from "@/lib/i18n";
import { useThemeFont } from "@/lib/theme-fonts";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const fonts = useThemeFont();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={[styles.eyebrow, { fontFamily: fonts.sans }]}>
          {t("lostAmongStars")}
        </Text>
        <Text style={[styles.title, { fontFamily: fonts.serifItalic }]}>
          {t("pageAsleep")}
        </Text>
        <Text style={[styles.body, { fontFamily: fonts.sans }]}>
          {t("pageAsleepBody")}
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={{ fontFamily: fonts.sansMedium, color: colors.night }}>
            {t("backHome")}
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.candle80,
  },
  title: {
    fontSize: 32,
    color: colors.foreground,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  link: {
    marginTop: 8,
    backgroundColor: colors.paper,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
});
