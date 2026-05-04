import { Text } from "@/src/components/Text";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { getEventsForDay } from "@/src/utils/events";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { events } = useCalendarContext();

  const dayDate = parseDateParam(date);
  const dayEvents = getEventsForDay(dayDate, events);

  if (dayEvents.length <= 0) return <Redirect href={`/event/${date}`} />;

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">{getFullDateString(dayDate)}</Text>
      {dayEvents.map((event) => (
        <View key={event.id}>
          <Text variant="title" className="text-base">
            {event.title}
          </Text>
          <Text>Start: {new Date(event.starts_at).toLocaleTimeString()}</Text>
          <Text>End: {new Date(event.ends_at).toLocaleTimeString()}</Text>
        </View>
      ))}
      <Button title="New Event" onPress={() => router.push(`/event/${date}`)} />
    </View>
  );
}
