import { Text } from "@/src/components/Text";
import { useEvents } from "@/src/hooks/useEvents";
import { getFullDateString, parseDateParam } from "@/src/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, View } from "react-native";

export default function NewEvent() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { createEvent } = useEvents();

  const router = useRouter();

  const dayDate = parseDateParam(date);

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title">Create New Event</Text>
      <Text>{getFullDateString(dayDate)}</Text>
      <Button
        title="Add test event"
        onPress={() => {
          const start = dayDate;
          const end = new Date(dayDate.getTime() + 60 * 60 * 1000);
          createEvent("Test Event", start, end);
          router.back();
        }}
      />
    </View>
  );
}
