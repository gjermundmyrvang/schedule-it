import { CalendarProvider } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  const { colors } = useTheme();
  return (
    <CalendarProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: new Date().toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            }),
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="profile" options={{ title: "profile" }} />
      </Stack>
    </CalendarProvider>
  );
}
