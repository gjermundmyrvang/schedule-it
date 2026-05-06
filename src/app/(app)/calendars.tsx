import { IconButton } from "@/src/components/IconButton";
import { Text } from "@/src/components/Text";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function Calendars() {
  const { colors } = useTheme();
  const { calendars, activeCalendar } = useCalendarContext();
  const router = useRouter();

  return (
    <View className="flex-1 px-4 pt-6 min-h-125 relative">
      <View className="flex-row justify-between items-center mb-4">
        <Text variant="title" className="text-3xl">
          Your Calendars
        </Text>
        <IconButton
          name="add"
          family="Ionicons"
          onPress={() => router.push("/new-calendar")}
        />
      </View>
      {calendars.map((cal) => (
        <TouchableOpacity
          key={cal.id}
          className="flex-row justify-between items-center border-b pb-2"
          style={{ borderColor: colors.border }}
        >
          <Text className="uppercase tracking-wider">{cal.name}</Text>
          {cal.id === activeCalendar?.id && (
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
