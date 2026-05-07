import { EventCard } from "@/src/components/events/EventCard";
import { IconButton } from "@/src/components/IconButton";
import { Text } from "@/src/components/Text";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { getEventsForDay } from "@/src/utils/events";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function DaySheet() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { events } = useCalendarContext();
  const { colors } = useTheme();

  const router = useRouter();

  const dayDate = parseDateParam(date);
  const dayEvents = getEventsForDay(dayDate, events);

  if (dayEvents.length <= 0) return <Redirect href={`/event/${date}`} />;

  return (
    <View className="flex-1 min-h-125">
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between">
            <Text
              variant="title"
              className="text-2xl font-bold text-neutral-900"
            >
              {getFullDateString(dayDate)}
            </Text>
            <IconButton
              name="calendar-plus"
              family="FontAwesome6"
              size={18}
              color={colors.accent}
              onPress={() => router.push(`/event/${date}`)}
            />
          </View>
          <Text className="text-sm text-neutral-400 mt-1">
            {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Events */}
        {dayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}
