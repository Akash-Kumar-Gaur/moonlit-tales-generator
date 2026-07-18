import { StyleSheet, View } from "react-native";
import { colors } from "@/lib/colors";

type MoonState = "new" | "half" | "full";

function MoonDot({ state }: { state: MoonState }) {
  if (state === "full") {
    return <View style={styles.full} />;
  }
  if (state === "half") {
    return (
      <View style={styles.halfOuter}>
        <View style={styles.halfFill} />
      </View>
    );
  }
  return <View style={styles.empty} />;
}

/** 6-dot moon-phase progress — filled = round(progress * 5), matching web. */
export function MoonProgress({
  value,
  label = "Story progress",
}: {
  value: number;
  label?: string;
}) {
  const phases = 6;
  const filled = Math.round(value * (phases - 1));

  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(value * 100),
      }}
    >
      {Array.from({ length: phases }).map((_, i) => (
        <MoonDot
          key={i}
          state={i < filled ? "full" : i === filled ? "half" : "new"}
        />
      ))}
    </View>
  );
}

const DOT = 10; // size-2.5 ≈ 10px

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  full: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: colors.ink,
  },
  halfOuter: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 1,
    borderColor: "rgba(31, 33, 46, 0.6)",
    overflow: "hidden",
  },
  halfFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "50%",
    backgroundColor: colors.ink,
  },
  empty: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 1,
    borderColor: colors.ink25,
  },
});
