import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { colors } from "@/lib/colors";
import { useTranslation } from "@/lib/i18n";
import { loadingStatuses } from "@/lib/translations";
import { useThemeFont } from "@/lib/theme-fonts";

export function LoadingWeave({ visible }: { visible: boolean }) {
  const { language } = useTranslation();
  const fonts = useThemeFont();
  const statuses = loadingStatuses(language);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStatusIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStatusIndex((i) => (i + 1) % statuses.length);
    }, 1500);
    return () => clearInterval(id);
  }, [visible, statuses.length]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <LottieView
        source={require("../assets/animations/loading.lottie")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={[styles.status, { fontFamily: fonts.serifItalic }]}>
        {statuses[statusIndex]}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  status: {
    marginTop: 8,
    fontSize: 18,
    color: colors.candle80,
    textAlign: "center",
  },
});
