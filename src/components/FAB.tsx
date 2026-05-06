// components/FAB.tsx
import { Ionicons } from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  bottom?: number;
  right?: number;
  size?: number;
}

export function FAB({
  icon,
  onPress,
  bottom = 20,
  right = 20,
  size = 22,
}: Props) {
  const { colors } = useTheme();

  return (
    <GlassView
      style={{
        position: "absolute",
        bottom,
        right,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isLiquidGlassAvailable()
          ? "transparent"
          : colors.placeholderText,
      }}
    >
      <Pressable onPress={onPress}>
        <Ionicons name={icon} size={size} color={colors.titleText} />
      </Pressable>
    </GlassView>
  );
}
