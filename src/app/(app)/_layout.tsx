import { CalendarProvider } from "@/src/providers/CalenderProvider";
import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <CalendarProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="profile" options={{ title: "profile" }} />
      </Stack>
    </CalendarProvider>
  );
}
