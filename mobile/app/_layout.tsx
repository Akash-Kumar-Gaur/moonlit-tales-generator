import { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
} from "@expo-google-fonts/lora";
import {
  TiroDevanagariHindi_400Regular,
  TiroDevanagariHindi_400Regular_Italic,
} from "@expo-google-fonts/tiro-devanagari-hindi";
import {
  Hind_400Regular,
  Hind_500Medium,
  Hind_600SemiBold,
} from "@expo-google-fonts/hind";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { ColdStartSplash } from "@/components/ColdStartSplash";
import { colors } from "@/lib/colors";
import { useStoryStore } from "@/lib/store";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    TiroDevanagariHindi_400Regular,
    TiroDevanagariHindi_400Regular_Italic,
    Hind_400Regular,
    Hind_500Medium,
    Hind_600SemiBold,
  });

  const initDevice = useStoryStore((s) => s.initDevice);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    initDevice();
  }, [initDevice]);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onSplashFinished = useCallback(() => {
    setSplashDone(true);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      {splashDone && (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.night },
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="read/[storyId]"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}
      <ColdStartSplash fontsReady={fontsLoaded} onFinished={onSplashFinished} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.night,
  },
});
