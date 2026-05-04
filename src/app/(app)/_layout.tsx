import { CalendarProvider } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function AppLayout() {
  const { colors } = useTheme();
  return (
    <CalendarProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            presentation: Platform.OS === "ios" ? "formSheet" : "modal",
            sheetAllowedDetents: "fitToContents",
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
            headerShown: false,
            contentStyle: {
              backgroundColor: isLiquidGlassAvailable()
                ? "transparent"
                : colors.background,
            },
          }}
        />
        <Stack.Screen
          name="event/[date]"
          options={{
            presentation: Platform.OS === "ios" ? "formSheet" : "modal",
            sheetAllowedDetents: "fitToContents",
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
            headerShown: false,
            contentStyle: {
              backgroundColor: isLiquidGlassAvailable()
                ? "transparent"
                : colors.background,
            },
          }}
        />
        <Stack.Screen name="profile" options={{ title: "profile" }} />
      </Stack>
    </CalendarProvider>
  );
}
