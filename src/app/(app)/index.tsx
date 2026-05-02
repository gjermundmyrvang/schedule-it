import { Text } from "@/src/components/Text";
import { useTheme } from "@/src/providers/ThemeProvider";
import { View } from "react-native";

export default function Homepage() {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.background }}
      className="flex-1 items-center justify-center"
    >
      <Text>Welcome to homescreen!</Text>
    </View>
  );
}
