import { View } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { Text } from "../Text";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarDayHeader() {
  const { colors } = useTheme();

  return (
    <View
      style={{ borderBottomColor: colors.border }}
      className="border-b pb-2"
    >
      <View className="flex-row justify-between">
        {DAYS.map((day) => (
          <View
            key={day}
            style={{ width: `${100 / 7}%` }}
            className="items-center py-1"
          >
            <Text className="text-xs font-medium">{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
