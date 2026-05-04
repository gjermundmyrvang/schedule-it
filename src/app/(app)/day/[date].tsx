import { Text } from "@/src/components/Text";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { getEventsForDay } from "@/src/utils/events";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { events, createEvent } = useCalendarContext();

  const dayDate = parseDateParam(date);
  const dayEvents = getEventsForDay(dayDate, events);

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">{getFullDateString(dayDate)}</Text>
      {dayEvents.map((event) => (
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
