import { Text } from "@/src/components/Text";
import { useEvents } from "@/src/hooks/useEvents";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { activeCalendar } = useCalendarContext();

  const dayDate = parseDateParam(date);

  const { events, createEvent } = useEvents(
    activeCalendar?.id ?? null,
    dayDate,
  );
  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">{getFullDateString(dayDate)}</Text>
      {events.map((event) => (
        <Text key={event.id}>{event.title}</Text>
      ))}
      <Button
        title="Add test event"
        onPress={() => {
          const start = dayDate;
          const end = new Date(dayDate.getTime() + 60 * 60 * 1000);
          createEvent("Test Event", start, end);
        }}
      />
    </View>
  );
}
