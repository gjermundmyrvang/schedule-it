// utils/navigation.ts
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform } from "react-native";

export function formSheetOptions(
  backgroundColor: string,
): NativeStackNavigationOptions {
  return {
    presentation: Platform.OS === "ios" ? "formSheet" : "modal",
    sheetAllowedDetents: "fitToContents",
    sheetGrabberVisible: true,
    sheetCornerRadius: 24,
    headerShown: false,
    contentStyle: {
      backgroundColor: isLiquidGlassAvailable()
        ? "transparent"
        : backgroundColor,
    },
  };
}
