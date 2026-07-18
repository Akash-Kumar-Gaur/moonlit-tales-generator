import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { colors } from "@/lib/colors";

/** In-memory flag — splash plays once per cold start, not per navigation. */
let hasPlayedThisSession = false;

interface ColdStartSplashProps {
  fontsReady: boolean;
  onFinished: () => void;
}

export function ColdStartSplash({
  fontsReady,
  onFinished,
}: ColdStartSplashProps) {
  const [visible, setVisible] = useState(() => !hasPlayedThisSession);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    hasPlayedThisSession = true;
    setVisible(false);
    onFinished();
  }, [onFinished]);

  // Skip immediately if already played this cold start
  useEffect(() => {
    if (hasPlayedThisSession) {
      finish();
    }
  }, [finish]);

  // Safety timeout if Lottie never fires onAnimationFinish
  useEffect(() => {
    if (!visible || !fontsReady) return;
    const id = setTimeout(finish, 4500);
    return () => clearTimeout(id);
  }, [visible, fontsReady, finish]);

  if (!visible) {
    return null;
  }

  if (!fontsReady) {
    return <View style={styles.overlay} />;
  }

  return (
    <Animated.View exiting={FadeOut.duration(400)} style={styles.overlay}>
      <LottieView
        source={require("../assets/animations/baby.lottie")}
        autoPlay
        loop={false}
        style={styles.lottie}
        onAnimationFinish={finish}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  lottie: {
    width: 220,
    height: 220,
  },
});
