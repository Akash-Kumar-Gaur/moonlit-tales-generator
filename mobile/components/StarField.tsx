import { StyleSheet, View } from "react-native";
import { colors } from "@/lib/colors";

/** Faint scattered stars — positions match the web's radial-gradient star field. */
const STARS = [
  { left: "20%", top: "12%", opacity: 0.6, size: 2 },
  { left: "78%", top: "22%", opacity: 0.5, size: 2 },
  { left: "55%", top: "38%", opacity: 0.4, size: 1.5 },
  { left: "12%", top: "55%", opacity: 0.3, size: 1.5 },
  { left: "88%", top: "65%", opacity: 0.4, size: 2 },
  { left: "40%", top: "18%", opacity: 0.35, size: 1.5 },
  { left: "65%", top: "50%", opacity: 0.3, size: 1.5 },
] as const;

export function StarField() {
  return (
    <View pointerEvents="none" style={styles.field}>
      {STARS.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  star: {
    position: "absolute",
    backgroundColor: colors.star,
  },
});
