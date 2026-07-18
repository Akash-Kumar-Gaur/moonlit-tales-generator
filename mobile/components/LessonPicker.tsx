import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/lib/colors";
import { useTranslation } from "@/lib/i18n";
import { LESSON_OPTIONS, lessonLabel, type LessonId } from "@/lib/stories";
import { useThemeFont } from "@/lib/theme-fonts";

interface LessonPickerProps {
  visible: boolean;
  value: LessonId;
  onChange: (lesson: LessonId) => void;
  onClose: () => void;
}

export function LessonPicker({
  visible,
  value,
  onChange,
  onClose,
}: LessonPickerProps) {
  const insets = useSafeAreaInsets();
  const { t, language } = useTranslation();
  const fonts = useThemeFont();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { fontFamily: fonts.serifItalic }]}>
            {t("lessonLabel")}
          </Text>
          {LESSON_OPTIONS.map((lesson) => {
            const active = value === lesson;
            return (
              <Pressable
                key={lesson}
                onPress={() => {
                  onChange(lesson);
                  onClose();
                }}
                style={[styles.option, active && styles.optionActive]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      fontFamily: active ? fonts.sansMedium : fonts.sans,
                    },
                    active && styles.optionTextActive,
                  ]}
                >
                  {lessonLabel(lesson, language)}
                </Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.nightCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: colors.foreground,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 4,
  },
  optionActive: {
    backgroundColor: colors.candleSoft10,
  },
  optionText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  optionTextActive: {
    color: colors.candle,
  },
});
