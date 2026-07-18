import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/lib/colors";

export function BackButton({
  onPress,
  label = "Back to home",
}: {
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.backBtn,
        pressed && { backgroundColor: colors.ink08 },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 6l-6 6 6 6"
          stroke={colors.ink}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

export function ReadAloudButton({
  reading,
  onPress,
  label,
  fontFamily,
}: {
  reading: boolean;
  onPress: () => void;
  label: string;
  fontFamily: string;
}) {
  const fg = reading ? colors.night : colors.paper;

  return (
    <Pressable
      onPress={onPress}
      accessibilityState={{ selected: reading }}
      style={[
        styles.readBtn,
        { backgroundColor: reading ? colors.candle : colors.ink },
      ]}
    >
      <View style={styles.readInner}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M4 10v4h3l4 3V7l-4 3H4z" fill={fg} />
          {reading && (
            <Path
              d="M15 9c1.2 1 1.2 5 0 6"
              stroke={fg}
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {reading && (
            <Path
              d="M18 6c2.5 2 2.5 10 0 12"
              stroke={fg}
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6}
            />
          )}
        </Svg>
        <Text style={[styles.readLabel, { color: fg, fontFamily }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function SaveButton({
  saved,
  onPress,
  label = "Save to library",
}: {
  saved: boolean;
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ selected: saved }}
      style={({ pressed }) => [
        styles.saveBtn,
        pressed && { backgroundColor: colors.ink08 },
      ]}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"
          fill={saved ? colors.ink : "none"}
          stroke={colors.ink}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink04,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  readBtn: {
    height: 56,
    flex: 2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  readInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readLabel: {
    fontSize: 14,
  },
  saveBtn: {
    height: 56,
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ink10,
    backgroundColor: colors.ink04,
    alignItems: "center",
    justifyContent: "center",
  },
});
