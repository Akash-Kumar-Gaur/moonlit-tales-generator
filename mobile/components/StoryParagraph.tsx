import { StyleSheet, Text } from "react-native";
import { colors } from "@/lib/colors";
import type { ThemeFonts } from "@/lib/theme-fonts";

export function DropCapParagraph({
  text,
  fonts,
}: {
  text: string;
  fonts: ThemeFonts;
}) {
  if (!text) return null;
  const first = text.charAt(0);
  const rest = text.slice(1);

  return (
    <Text style={[styles.body, { fontFamily: fonts.serif }]}>
      <Text style={[styles.drop, { fontFamily: fonts.serifItalic }]}>
        {first}
      </Text>
      {rest}
    </Text>
  );
}

export function StoryParagraph({
  text,
  fonts,
}: {
  text: string;
  fonts: ThemeFonts;
}) {
  return (
    <Text style={[styles.body, { fontFamily: fonts.serif }]}>{text}</Text>
  );
}

const styles = StyleSheet.create({
  drop: {
    fontSize: 48,
    lineHeight: 44,
    color: colors.ink90,
  },
  body: {
    fontSize: 18.4,
    lineHeight: 34,
    color: colors.ink90,
  },
});
