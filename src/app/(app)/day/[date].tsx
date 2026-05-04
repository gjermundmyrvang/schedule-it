import { Text } from "@/src/components/Text";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const dayDate = parseDateParam(date);

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">{getFullDateString(dayDate)}</Text>
    </View>
  );
}
