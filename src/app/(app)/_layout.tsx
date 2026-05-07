import { CalendarProvider } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { formSheetOptions } from "@/src/utils/navigation";
import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  const { colors } = useTheme();
  const formSheetStyle = formSheetOptions(colors.background);
  return (
    <CalendarProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="day/[date]" options={formSheetStyle} />
        <Stack.Screen name="event/[date]" options={formSheetStyle} />
        <Stack.Screen name="calendars" options={formSheetStyle} />
        <Stack.Screen name="new-calendar" options={formSheetStyle} />
        <Stack.Screen name="share-calendar/[code]" options={formSheetStyle} />
        <Stack.Screen name="profile" options={{ title: "profile" }} />
      </Stack>
    </CalendarProvider>
  );
}
