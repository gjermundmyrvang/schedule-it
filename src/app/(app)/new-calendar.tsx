import { Text } from "@/src/components/Text";
import { useCalendars } from "@/src/hooks/useCalendar";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  TextInput,
  View,
} from "react-native";

export default function NewCalendar() {
  const { colors } = useTheme();
  const { createCalendar, joinCalendar } = useCalendars();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
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

  const handleJoin = async () => {
    if (code.trim().length < 6) {
      Alert.alert("Enter a valid 6-character code.");
      return;
    }
    setLoading(true);
    await joinCalendar(code.trim());
    setLoading(false);
    router.back();
  };

  const isCreate = mode === "create";

  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      {/* Toggle */}
      <View
        className="flex-row rounded-full p-1 mb-8"
        style={{ backgroundColor: colors.border }}
      >
        {(["create", "join"] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            className="flex-1 py-2.5 rounded-full items-center"
            style={{
              backgroundColor: mode === m ? colors.background : "transparent",
            }}
          >
            <Text className="font-semibold text-sm">
              {m === "create" ? "New Calendar" : "Join Calendar"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Title */}
      <Text
        variant="title"
        className="text-3xl mb-2"
        style={{ color: colors.titleText }}
      >
        {isCreate ? "Create Calendar" : "Join Calendar"}
      </Text>

      {/* Hint */}
      <Text className="text-xs mb-6" style={{ color: colors.placeholderText }}>
        {isCreate
          ? "You'll get an invite code to share with others."
          : "Ask the calendar owner for their 6-character invite code."}
      </Text>

      {isCreate ? (
        <CreateInput value={name} onChange={setName} />
      ) : (
        <JoinInput value={code} onChange={setCode} />
      )}

      {/* Action button */}
      <Pressable
        onPress={isCreate ? handleCreateCalendar : handleJoin}
        disabled={loading}
        className="mt-6 rounded-full py-4 items-center"
        style={{ backgroundColor: colors.accent }}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            className="font-semibold text-base"
            style={{ color: colors.background }}
          >
            {isCreate ? "Create" : "Join"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

function CreateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholder="My Shared Calendar..."
      placeholderTextColor={colors.placeholderText}
      value={value}
      onChangeText={onChange}
      style={{
        borderColor: colors.border,
        color: colors.titleText,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    />
  );
}

function JoinInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholder="ABC123"
      placeholderTextColor={colors.placeholderText}
      value={value}
      onChangeText={(t) => onChange(t.toUpperCase())}
      autoCapitalize="characters"
      maxLength={6}
      style={{
        borderColor: colors.border,
        color: colors.titleText,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 14,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 8,
      }}
    />
  );
}
