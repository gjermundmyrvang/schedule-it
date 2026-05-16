import { IconButton } from "@/src/components/IconButton";
import { Text } from "@/src/components/Text";
import { useCalendars } from "@/src/hooks/useCalendar";
import { useAuth } from "@/src/providers/AuthProvider";
import { useCalendarContext } from "@/src/providers/CalenderProvider";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Calendar } from "@/src/types/supabase-types";
import { confirmDelete } from "@/src/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";

export default function Calendars() {
  const { colors } = useTheme();
  const {
    calendars,
    isLoadingCalendars,
    activeCalendar,
    setActiveCalendar,
    refetchCalendars,
  } = useCalendarContext();
  const { user } = useAuth();
  const { deleteCalendar, leaveCalendar } = useCalendars();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteCalendar = async (id: string) => {
    if (id === activeCalendar?.id) {
      Alert.alert("Cannot delete active calendar");
      return;
    }
    const confirmed = await confirmDelete("Calendar?");
    if (!confirmed) return;
    setLoading(true);
    await deleteCalendar(id);
    await refetchCalendars();
    setLoading(false);
  };

  const handleLeaveCalendar = async (id: string) => {
    if (id === activeCalendar?.id) {
      Alert.alert("Cannot leave active calendar");
      return;
    }
    setLoading(true);
    await leaveCalendar(id);
    await refetchCalendars();
    setLoading(false);
  };

  const isDefault = (cal: Calendar) => cal.is_default;

  if (isLoadingCalendars)
    return (
      <View className="flex-1 justify-center items-center min-h-125">
        <ActivityIndicator size={"small"} />
      </View>
    );

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
          className="flex-row justify-between items-center border-b py-4"
          style={{ borderColor: colors.border }}
          onPress={() => setActiveCalendar(cal)}
        >
          <View className="flex-row items-center gap-2">
            <Text className="uppercase tracking-wider">{cal.name}</Text>
            {cal.id === activeCalendar?.id && (
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
            )}
          </View>
          <View className="flex-row items-center gap-2">
            {!isDefault(cal) && (
              <>
                <IconButton
                  family="Ionicons"
                  name="share"
                  size={16}
                  onPress={() =>
                    router.push(`/share-calendar/${cal.invite_code}`)
                  }
                />

                {cal.created_by === user?.id ? (
                  <IconButton
                    family="Ionicons"
                    name="trash"
                    size={16}
                    onPress={() => handleDeleteCalendar(cal.id)}
                  />
                ) : (
                  <IconButton
                    family="Ionicons"
                    name="exit-outline"
                    size={16}
                    onPress={() => handleLeaveCalendar(cal.id)}
                  />
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
