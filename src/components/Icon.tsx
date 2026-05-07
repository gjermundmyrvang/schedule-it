import * as ExpoIcons from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeProvider";

type IconFamily = keyof typeof ExpoIcons;

interface Props {
  family: IconFamily;
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ family, name, size = 24, color }: Props) {
  const { colors } = useTheme();
  const IconComponent = (ExpoIcons as Record<IconFamily, any>)[family];

  return (
    <IconComponent name={name} size={size} color={color ?? colors.labelText} />
  );
}
