import { Text } from "@/src/components/Text";
import { parseDateParam } from "@/src/utils/utils";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const dayDate = parseDateParam(date);
  const label = dayDate.toLocaleDateString("default", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">{label}</Text>
    </View>
  );
}
