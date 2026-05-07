import { Text } from "@/src/components/Text";
import { useCalendars } from "@/src/hooks/useCalendar";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

export default function NewCalendar() {
  const { colors } = useTheme();
  const { createCalendar } = useCalendars();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCreateCalendar = async () => {
    if (name.trim() === "") {
      Alert.alert("Name cannot be blank!");
      return;
    }
    setLoading(true);
    await createCalendar(name);
    setLoading(false);
    router.back();
  };

  return (
    <View className="flex-1 h-screen px-4 pt-6">
      <View>
        <Text variant="title" className="text-3xl">
          Create Calendar
        </Text>
        <TextInput
          placeholder="My Shared Calendar..."
          placeholderTextColor={colors.placeholderText}
          value={name}
          onChangeText={setName}
          autoFocus
          style={{
            borderColor: colors.border,
          }}
          className="mt-4 w-full rounded-full border px-4 py-4"
        />
      </View>
      <Button
        title={loading ? "creating..." : "Create"}
        onPress={handleCreateCalendar}
      />
    </View>
  );
}
