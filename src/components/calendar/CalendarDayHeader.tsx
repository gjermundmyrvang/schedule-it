import { getMonthString } from "@/src/utils/utils";
import { useRouter } from "expo-router";
import { Dimensions, View } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { IconButton } from "../IconButton";
import { Text } from "../Text";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  date: Date;
}

export function CalendarDayHeader({ date }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  const CELL_SIZE = Math.floor(Dimensions.get("window").width / 7);

  return (
    <View
      style={{ borderBottomColor: colors.border }}
      className="mt-safe border-b"
    >
      <View className="flex-row items-center justify-between mr-2">
        <Text variant="title" className="text-5xl px-4 font-extrabold">
          {getMonthString(date)}
        </Text>
        <IconButton
          name="person"
          family="Ionicons"
          color={colors.accent}
          onPress={() => router.push("/profile")}
        />
      </View>
      <View className="flex-row justify-between">
        {DAYS.map((day) => (
          <View
            key={day}
            style={{ width: CELL_SIZE }}
            className="items-center py-1"
          >
            <Text variant="placeholder" className="text-xs font-medium">
              {day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
