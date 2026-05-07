import { Text } from "@/src/components/Text";
import { useTheme } from "@/src/providers/ThemeProvider";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

export default function ShareCalendar() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <View className="flex-1 px-4 pt-6 min-h-125">
      <Text variant="title" className="text-3xl mb-1">
        Invite Code
      </Text>
      <Text variant="placeholder" className="text-sm mb-8">
        Share this code with anyone you want to invite.
      </Text>

      <Pressable
        onPress={handleCopy}
        className="rounded-2xl py-8 items-center active:opacity-70"
        style={{ backgroundColor: colors.border }}
      >
        <Text
          variant="title"
          className="text-4xl mb-2 uppercase"
          style={{ color: colors.titleText, letterSpacing: 10 }}
        >
          {code}
        </Text>
        <Text
          className="text-xs"
          style={{ color: copied ? colors.accent : colors.placeholderText }}
        >
          {copied ? "✓ Copied!" : "Tap to copy"}
        </Text>
      </Pressable>
    </View>
  );
}
