import * as ExpoIcons from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, PressableProps } from "react-native";
import { useTheme } from "../providers/ThemeProvider";
import { Icon } from "./Icon";

type IconFamily = keyof typeof ExpoIcons;

interface Props extends PressableProps {
  family: IconFamily;
  name: string;
  size?: number;
  color?: string;
}

export function IconButton({
  family,
  name,
  size = 24,
  color,
  disabled,
  className,
  ...props
}: Props) {
  const { colors } = useTheme();

  return (
    <GlassView
      isInteractive
      style={{
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
      <Pressable disabled={disabled} {...props}>
        <Icon family={family} name={name} size={size} color={color} />
      </Pressable>
    </GlassView>
  );
}
